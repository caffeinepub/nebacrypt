import List "mo:core/List";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Debug "mo:core/Debug";

import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import EmailClient "email/emailClient";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type ProjectBudgetRange = {
    #range1_10kNOK;
    #range10_50kNOK;
    #range50_100kNOK;
    #range100kPlusNOK;
  };

  type ProjectStatus = {
    #new;
    #reviewed;
    #followup;
    #inProgress;
    #completed;
  };

  public type Message = {
    sender : Text;
    timestamp : Int;
    text : Text;
  };

  public type ProjectSubmission = {
    id : Nat;
    clientName : Text;
    companyName : Text;
    email : Text;
    projectDescription : Text;
    timeline : Text;
    budget : ProjectBudgetRange;
    timestamp : Int;
    status : ProjectStatus;
    statusComment : ?Text;
    submittedBy : Principal;
    files : [Storage.ExternalBlob];
    messages : [Message];
    deliveryLink : ?Text;
    deliveryDescription : ?Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    company : Text;
  };

  module ProjectSubmission {
    public func compareByTimestamp(a : ProjectSubmission, b : ProjectSubmission) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };

    public func compareByClientName(a : ProjectSubmission, b : ProjectSubmission) : Order.Order {
      Text.compare(a.clientName, b.clientName);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextSubmissionId = 1;
  let adminEmail = "ceo@nebacrypt.com";

  var submissions = {
    list = List.empty<ProjectSubmission>();
    projectIdMap = Map.empty<Nat, ProjectSubmission>();
    authenticatedProjects = Map.empty<Principal, List.List<ProjectSubmission>>();
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management - Requires user permission
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Uautorisert: Kun brukere kan se profiler");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Uautorisert: Kan kun vise din egen profil");
    };
    userProfiles.get(user);
  };

  // Create new user profile - only allowed if profile does not exist
  public shared ({ caller }) func createUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Uautorisert: Kun brukere kan opprette profiler");
    };

    // Check if profile already exists
    switch (userProfiles.get(caller)) {
      case (?_existingProfile) {
        Runtime.trap("Profil eksisterer allerede. Bruk updateUserProfile for å oppdatere.");
      };
      case (null) {
        userProfiles.add(caller, profile);
      };
    };
  };

  // Update existing user profile - only allowed if profile exists
  public shared ({ caller }) func updateUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Uautorisert: Kun brukere kan oppdatere profiler");
    };

    // Check if profile exists
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profil finnes ikke. Bruk createUserProfile for å opprette en ny profil.");
      };
      case (?_existingProfile) {
        userProfiles.add(caller, profile);
      };
    };
  };

  // Legacy function for backward compatibility - creates if not exists, updates if exists
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Uautorisert: Kun brukere kan lagre profiler");
    };

    // This function allows both create and update for backward compatibility
    // Frontend should prefer using createUserProfile and updateUserProfile explicitly
    userProfiles.add(caller, profile);
  };

  // Public Project Submission - Allows guest access (anonymous users)
  public shared ({ caller }) func submitProject(
    clientName : Text,
    companyName : Text,
    email : Text,
    projectDescription : Text,
    timeline : Text,
    budget : ProjectBudgetRange,
  ) : async {
    projectId : Nat;
    timestamp : Int;
  } {
    // No authorization check - this endpoint is public and allows guest submissions
    let projectId = nextSubmissionId;
    nextSubmissionId += 1;
    let timestamp = Time.now();

    let newSubmission : ProjectSubmission = {
      id = projectId;
      clientName;
      companyName;
      email;
      projectDescription;
      timeline;
      budget;
      timestamp;
      status = #new;
      statusComment = null;
      submittedBy = caller;
      files = [];
      messages = [];
      deliveryLink = null;
      deliveryDescription = null;
    };

    let singleSubmissionArray = [newSubmission];
    submissions := {
      list = List.fromArray<ProjectSubmission>(singleSubmissionArray.concat(submissions.list.toArray()));
      projectIdMap = submissions.projectIdMap;
      authenticatedProjects = submissions.authenticatedProjects;
    };

    submissions.projectIdMap.add(projectId, newSubmission);
    ignore doSendAdminNotification(clientName, companyName, email, projectDescription, timeline, budget);
    ignore doSendClientConfirmation(email, projectId, clientName, companyName, projectDescription, timeline, budget);

    {
      projectId;
      timestamp;
    };
  };

  // Authenticated Project Submission - Requires user permission
  public shared ({ caller }) func submitAuthenticatedProject(
    clientName : Text,
    companyName : Text,
    email : Text,
    projectDescription : Text,
    timeline : Text,
    budget : ProjectBudgetRange,
    files : [Storage.ExternalBlob],
  ) : async {
    projectId : Nat;
    timestamp : Int;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Uautorisert: Kun autentiserte brukere kan sende inn prosjekter med filopplasting");
    };

    let projectId = nextSubmissionId;
    nextSubmissionId += 1;
    let timestamp = Time.now();

    let newSubmission : ProjectSubmission = {
      id = projectId;
      clientName;
      companyName;
      email;
      projectDescription;
      timeline;
      budget;
      timestamp;
      status = #new;
      statusComment = null;
      submittedBy = caller;
      files;
      messages = [];
      deliveryLink = null;
      deliveryDescription = null;
    };

    let singleSubmissionArray = [newSubmission];
    submissions := {
      list = List.fromArray<ProjectSubmission>(singleSubmissionArray.concat(submissions.list.toArray()));
      projectIdMap = submissions.projectIdMap;
      authenticatedProjects = submissions.authenticatedProjects;
    };
    submissions.projectIdMap.add(projectId, newSubmission);

    let currentUserProjects = switch (submissions.authenticatedProjects.get(caller)) {
      case (?existingList) { existingList };
      case (null) { List.empty<ProjectSubmission>() };
    };
    let singleSubmissionArrayProjects = [newSubmission];
    let userProjectsArray = currentUserProjects.toArray();
    let updatedUserProjects = List.fromArray<ProjectSubmission>(singleSubmissionArrayProjects.concat(userProjectsArray));
    submissions.authenticatedProjects.add(caller, updatedUserProjects);

    ignore doSendAdminNotification(clientName, companyName, email, projectDescription, timeline, budget);
    ignore doSendClientConfirmation(email, projectId, clientName, companyName, projectDescription, timeline, budget);

    {
      projectId;
      timestamp;
    };
  };

  // Internal helper functions - private and never fail in async context
  func doSendAdminNotification(
    clientName : Text,
    companyName : Text,
    email : Text,
    projectDescription : Text,
    timeline : Text,
    budget : ProjectBudgetRange,
  ) : async () {
    let emailSubject = "Ny prosjektsendelse fra " # clientName;
    let emailBody =
      "Klientnavn: " # clientName # "\n"
      # "Firma: " # companyName # "\n"
      # "E-post: " # email # "\n"
      # "Prosjektbeskrivelse: " # projectDescription # "\n"
      # "Tidsramme: " # timeline # "\n"
      # "Budsjett: " # getBudgetRangeText(budget);

    let emailResult = await EmailClient.sendServiceEmail(
      "no-reply",
      [adminEmail],
      emailSubject,
      emailBody,
    );

    switch (emailResult) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av varslings-e-post ('doSendAdminNotification'), blir ignorert: " # error);
      };
    };
  };

  func doSendClientConfirmation(
    recipientEmail : Text,
    projectId : Nat,
    clientName : Text,
    companyName : Text,
    projectDescription : Text,
    timeline : Text,
    budget : ProjectBudgetRange,
  ) : async () {
    let subject = "Bekreftelse på mottatt prosjektforspørsel hos Nebacrypt AI & Utviklingstjenester";
    let body =
      "Kjære " # clientName # ",\n\n"
      # "Vi har mottatt din prosjektforspørsel til Nebacrypt AI & Utviklingstjenester. Takk for at du vurderer oss til å bistå med utviklingsarbeidet!\n\n"
      # "Prosjekt-ID: " # projectId.toText() # "\n"
      # "Prosjektbeskrivelse: " # projectDescription # "\n"
      # "Tidsramme: " # timeline # "\n"
      # "Budsjett: " # getBudgetRangeText(budget) # "\n\n"
      # "Vi vil gjennomgå henvendelsen og komme tilbake til deg med en detaljert vurdering så snart som mulig.\n\n"
      # "Ta gjerne kontakt dersom du har spørsmål eller ønsker å gi tilleggskontekst.\n\n"
      # "Med vennlig hilsen,\n"
      # "Nebadon Encryption AS";

    switch (await EmailClient.sendServiceEmail("no-reply", [recipientEmail], subject, body)) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av bekreftelses-e-post for klient ('doSendClientConfirmation'), blir ignorert: " # error);
      };
    };
  };

  func getBudgetRangeText(budget : ProjectBudgetRange) : Text {
    switch (budget) {
      case (#range1_10kNOK) { "1 000 – 10 000 NOK" };
      case (#range10_50kNOK) { "10 000 – 50 000 NOK" };
      case (#range50_100kNOK) { "50 000 – 100 000 NOK" };
      case (#range100kPlusNOK) { "100 000 NOK +" };
    };
  };

  // Admin-only functions for viewing all submissions
  public query ({ caller }) func getAllSubmissions() : async [ProjectSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan se alle bidrag");
    };
    submissions.list.toArray().sort(ProjectSubmission.compareByTimestamp);
  };

  public query ({ caller }) func getSubmissionsByStatus(status : ProjectStatus) : async [ProjectSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan filtrere bidrag");
    };
    submissions.list.toArray().filter<ProjectSubmission>(
      func(submission) {
        submission.status == status;
      }
    );
  };

  // Admin-only status update functions
  public shared ({ caller }) func markAsReviewed(projectId : Nat, comment : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan oppdatere prosjektstatus");
    };
    await updateProjectStatus(projectId, #reviewed, comment);
  };

  public shared ({ caller }) func markAsFollowup(projectId : Nat, comment : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan oppdatere prosjektstatus");
    };
    await updateProjectStatus(projectId, #followup, comment);
  };

  public shared ({ caller }) func markAsInProgress(projectId : Nat, comment : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan oppdatere prosjektstatus");
    };
    await updateProjectStatus(projectId, #inProgress, comment);
  };

  public shared ({ caller }) func markAsCompleted(projectId : Nat, comment : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan oppdatere prosjektstatus");
    };
    await updateProjectStatus(projectId, #completed, comment);
  };

  // Internal function for updating project status - called only by admin functions above
  func updateProjectStatus(
    projectId : Nat,
    newStatus : ProjectStatus,
    comment : ?Text,
  ) : async () {
    let existing = submissions.projectIdMap.get(projectId);
    switch (existing) {
      case (null) { Runtime.trap("Prosjektbidrag ikke funnet") };
      case (?submission) {
        let updatedSubmission : ProjectSubmission = {
          submission with
          status = newStatus;
          statusComment = comment;
        };

        // Update map
        submissions.projectIdMap.add(projectId, updatedSubmission);

        // Update list
        submissions := {
          list = submissions.list.map<ProjectSubmission, ProjectSubmission>(
            func(s) {
              if (s.id == projectId) { updatedSubmission } else { s };
            }
          );
          projectIdMap = submissions.projectIdMap;
          authenticatedProjects = submissions.authenticatedProjects;
        };

        // Update authenticatedProjects map
        switch (submissions.authenticatedProjects.get(submission.submittedBy)) {
          case (?userProjects) {
            let updatedUserProjects = userProjects.map<ProjectSubmission, ProjectSubmission>(
              func(project) {
                if (project.id == projectId) { updatedSubmission } else { project };
              }
            );
            submissions.authenticatedProjects.add(submission.submittedBy, updatedUserProjects);
          };
          case (null) {};
        };

        switch (newStatus) {
          case (#reviewed) {
            ignore doSendProjectReviewedNotification(
              submission.email,
              submission.clientName,
              submission.projectDescription,
              comment,
            );
          };
          case (#followup) {
            ignore doSendProjectFollowupNotification(
              submission.email,
              submission.clientName,
              submission.projectDescription,
              comment,
            );
          };
          case (#inProgress) {
            ignore doSendProjectInProgressNotification(
              submission.email,
              submission.clientName,
              submission.projectDescription,
              comment,
            );
          };
          case (#completed) {
            ignore doSendProjectCompletedNotification(
              submission.email,
              submission.clientName,
              submission.projectDescription,
              comment,
            );
          };
          case (_) {};
        };
      };
    };
  };

  func doSendProjectReviewedNotification(
    recipientEmail : Text,
    clientName : Text,
    projectDescription : Text,
    comment : ?Text,
  ) : async () {
    let subject = "Oppdatering: Prosjekt hos Nebacrypt AI & Utviklingstjenester gjennomgått";
    let body =
      "Hei " # clientName # ",\n\n"
      # "Vi har nå gjennomgått ditt prosjekt hos Nebacrypt AI & Utviklingstjenester.\n\n"
      # "Prosjektbeskrivelse: " # projectDescription # "\n\n"
      # "Vi vil følge opp med en mer detaljert vurdering og anbefalinger snart.\n\n"
      # (switch (comment) {
          case (null) { "" };
          case (?c) { "\nAdmin kommentar: " # c # "\n\n" };
        })
      # "Ta gjerne kontakt dersom du har spørsmål eller ønsker å diskutere prosjektet videre.\n\n"
      # "Med vennlig hilsen,\n"
      # "Nebadon Encryption AS";

    switch (await EmailClient.sendServiceEmail("no-reply", [recipientEmail], subject, body)) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av varslings-e-post ('doSendProjectReviewedNotification'), blir ignorert: " # error);
      };
    };
  };

  func doSendProjectFollowupNotification(
    recipientEmail : Text,
    clientName : Text,
    projectDescription : Text,
    comment : ?Text,
  ) : async () {
    let subject = "Trenger oppfølging: Prosjekt hos Nebacrypt AI & Utviklingstjenester";
    let body =
      "Hei " # clientName # ",\n\n"
      # "Vi har gjennomgått prosjektet ditt hos Nebacrypt AI & Utviklingstjenester. Vi trenger mer informasjon eller avklaring før vi kan fortsette prosessen.\n\n"
      # "Prosjektbeskrivelse: " # projectDescription # "\n\n"
      # "Vennligst ta kontakt for å diskutere ytterligere detaljer eller gi svar på eventuelle spørsmål vi måtte ha stilt.\n\n"
      # (switch (comment) {
          case (null) { "" };
          case (?c) { "\nAdmin kommentar: " # c # "\n\n" };
        })
      # "Takk for samarbeidet!\n\n"
      # "Med vennlig hilsen,\n"
      # "Nebadon Encryption AS";

    switch (await EmailClient.sendServiceEmail("no-reply", [recipientEmail], subject, body)) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av varslings-e-post ('doSendProjectFollowupNotification'), blir ignorert: " # error);
      };
    };
  };

  func doSendProjectInProgressNotification(
    recipientEmail : Text,
    clientName : Text,
    projectDescription : Text,
    comment : ?Text,
  ) : async () {
    let subject = "Statusoppdatering: Prosjekt 'Under arbeid' hos Nebacrypt AI & Utviklingstjenester";
    let body =
      "Hei " # clientName # ",\n\n"
      # "Vi har satt prosjektet '" # projectDescription # "' til status 'Under arbeid'. Vårt team har startet arbeidet med å implementere løsningen din.\n\n"
      # (switch (comment) {
          case (null) { "" };
          case (?c) { "\nAdmin kommentar: " # c # "\n\n" };
        })
      # "Vi holder deg oppdatert om fremgangen og eventuelle milepæler underveis.\n\n"
      # "Ta gjerne kontakt dersom du har spørsmål eller ønsker mer informasjon om status.\n\n"
      # "Med vennlig hilsen,\n"
      # "Nebadon Encryption AS";

    switch (await EmailClient.sendServiceEmail("no-reply", [recipientEmail], subject, body)) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av varslings-e-post ('doSendProjectInProgressNotification'), blir ignorert: " # error);
      };
    };
  };

  func doSendProjectCompletedNotification(
    recipientEmail : Text,
    clientName : Text,
    projectDescription : Text,
    comment : ?Text,
  ) : async () {
    let subject = "Statusoppdatering: Prosjekt 'Fullført' hos Nebacrypt AI & Utviklingstjenester";
    let body =
      "Hei " # clientName # ",\n\n"
      # "Vi er glade for å informere deg om at prosjektet '" # projectDescription
      # "' nå er blitt fullført. Vårt team har jobbet dedikert for å ferdigstille løsningen i henhold til dine krav og spesifikasjoner.\n\n"
      # "Prosjektstatus er nå satt til 'Fullført'.\n\n"
      # (switch (comment) {
          case (null) { "" };
          case (?c) { "\nAdmin kommentar: " # c # "\n\n" };
        })
      # "Dersom du har spørsmål, ønsker ytterligere forbedringer, eller trenger support, er du alltid velkommen til å ta kontakt med oss.\n\n"
      # "Vi takker for tilliten og ser frem til et videre samarbeid.\n\n"
      # "Med vennlig hilsen,\n"
      # "Nebadon Encryption AS";

    switch (await EmailClient.sendServiceEmail("no-reply", [recipientEmail], subject, body)) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av varslings-e-post ('doSendProjectCompletedNotification'), blir ignorert: " # error);
      };
    };
  };

  // View individual submission - requires ownership or admin access
  public query ({ caller }) func getSubmission(projectId : Nat) : async ProjectSubmission {
    switch (submissions.projectIdMap.get(projectId)) {
      case (null) { Runtime.trap("Prosjektbidrag ikke funnet") };
      case (?submission) {
        if (not AccessControl.isAdmin(accessControlState, caller) and caller != submission.submittedBy) {
          Runtime.trap("Uautorisert: Kan kun se egne bidrag");
        };
        submission;
      };
    };
  };

  // Admin-only function to search submissions by client name
  public query ({ caller }) func getSubmissionsByClient(clientName : Text) : async [ProjectSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan søke bidrag per klient");
    };

    submissions.list.toArray().filter<ProjectSubmission>(
      func(submission) {
        submission.clientName == clientName;
      }
    );
  };

  // User function to view their own projects - requires user permission
  public query ({ caller }) func getUserProjects() : async [ProjectSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Uautorisert: Kun autentiserte brukere kan se sine prosjekter");
    };

    switch (submissions.authenticatedProjects.get(caller)) {
      case (?projects) {
        projects.toArray().sort(ProjectSubmission.compareByTimestamp);
      };
      case (null) { [] };
    };
  };

  // View project files - requires ownership or admin access
  public query ({ caller }) func getProjectFiles(projectId : Nat) : async [Storage.ExternalBlob] {
    switch (submissions.projectIdMap.get(projectId)) {
      case (null) { Runtime.trap("Prosjektbidrag ikke funnet") };
      case (?submission) {
        // Allow access if caller is admin OR if caller owns the project
        if (not AccessControl.isAdmin(accessControlState, caller) and caller != submission.submittedBy) {
          Runtime.trap("Uautorisert: Kan kun få tilgang til egne filer");
        };
        submission.files;
      };
    };
  };

  // Get messages for a specific project - requires ownership or admin access
  public query ({ caller }) func getProjectMessages(projectId : Nat) : async [Message] {
    switch (submissions.projectIdMap.get(projectId)) {
      case (null) { Runtime.trap("Prosjektbidrag ikke funnet") };
      case (?submission) {
        // Allow access if caller is admin OR if caller owns the project
        if (not AccessControl.isAdmin(accessControlState, caller) and caller != submission.submittedBy) {
          Runtime.trap("Uautorisert: Kan kun se meldinger for egne prosjekter");
        };
        submission.messages;
      };
    };
  };

  // Get all messages for the current user across all their projects - requires user permission
  public query ({ caller }) func getAllUserMessages() : async [(Nat, [Message])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Uautorisert: Kun autentiserte brukere kan se sine meldinger");
    };

    switch (submissions.authenticatedProjects.get(caller)) {
      case (?projects) {
        projects.toArray().map<ProjectSubmission, (Nat, [Message])>(
          func(project) {
            (project.id, project.messages);
          }
        );
      };
      case (null) { [] };
    };
  };

  // Get all messages across all projects - admin only (for Kundeservice view)
  public query ({ caller }) func getAllMessages() : async [(Nat, [Message])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan se alle meldinger");
    };

    submissions.list.toArray().map<ProjectSubmission, (Nat, [Message])>(
      func(submission) {
        (submission.id, submission.messages);
      }
    );
  };

  // Send message to a project - requires ownership or admin access
  public shared ({ caller }) func sendMessage(projectId : Nat, sender : Text, text : Text) : async () {
    let existing = submissions.projectIdMap.get(projectId);
    switch (existing) {
      case (null) { Runtime.trap("Prosjektbidrag ikke funnet") };
      case (?submission) {
        // Authorization: Only project owner or admin can send messages
        if (not AccessControl.isAdmin(accessControlState, caller) and caller != submission.submittedBy) {
          Runtime.trap("Uautorisert: Kun prosjekteier eller administrator kan sende meldinger");
        };

        let newMessage : Message = {
          sender;
          timestamp = Time.now();
          text;
        };

        let updatedMessages = [newMessage].concat(submission.messages);
        let updatedSubmission : ProjectSubmission = {
          submission with messages = updatedMessages
        };

        // Update map
        submissions.projectIdMap.add(projectId, updatedSubmission);

        // Update list
        submissions := {
          list = submissions.list.map<ProjectSubmission, ProjectSubmission>(
            func(s) {
              if (s.id == projectId) { updatedSubmission } else { s };
            }
          );
          projectIdMap = submissions.projectIdMap;
          authenticatedProjects = submissions.authenticatedProjects;
        };

        // Update authenticatedProjects map
        switch (submissions.authenticatedProjects.get(submission.submittedBy)) {
          case (?userProjects) {
            let updatedUserProjects = userProjects.map<ProjectSubmission, ProjectSubmission>(
              func(project) {
                if (project.id == projectId) { updatedSubmission } else { project };
              }
            );
            submissions.authenticatedProjects.add(submission.submittedBy, updatedUserProjects);
          };
          case (null) {};
        };

        // Send email notification to the recipient
        // If admin sent the message, notify client; if client sent, notify admin
        if (AccessControl.isAdmin(accessControlState, caller)) {
          ignore doSendMessageNotification(submission.email, sender, text);
        } else {
          ignore doSendMessageNotification(adminEmail, sender, text);
        };
      };
    };
  };

  func doSendMessageNotification(recipientEmail : Text, sender : Text, text : Text) : async () {
    let subject = "Ny melding fra " # sender;
    let body =
      "Du har mottatt en ny melding fra " # sender # ":\n\n"
      # text # "\n\n"
      # "Med vennlig hilsen,\n"
      # "Nebadon Encryption AS";

    switch (await EmailClient.sendServiceEmail("no-reply", [recipientEmail], subject, body)) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av varslings-e-post ('doSendMessageNotification'), blir ignorert: " # error);
      };
    };
  };

  // Delivery link functionality - admin only
  public shared ({ caller }) func addDeliveryLink(projectId : Nat, link : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Uautorisert: Kun administratorer kan legge til leveringslenker");
    };

    let existing = submissions.projectIdMap.get(projectId);
    switch (existing) {
      case (null) { Runtime.trap("Prosjektbidrag ikke funnet") };
      case (?submission) {
        let updatedSubmission : ProjectSubmission = {
          submission with
          deliveryLink = ?link;
          deliveryDescription = ?description;
        };

        // Update map
        submissions.projectIdMap.add(projectId, updatedSubmission);

        // Update list
        submissions := {
          list = submissions.list.map<ProjectSubmission, ProjectSubmission>(
            func(s) {
              if (s.id == projectId) { updatedSubmission } else { s };
            }
          );
          projectIdMap = submissions.projectIdMap;
          authenticatedProjects = submissions.authenticatedProjects;
        };

        // Update authenticatedProjects map
        switch (submissions.authenticatedProjects.get(submission.submittedBy)) {
          case (?userProjects) {
            let updatedUserProjects = userProjects.map<ProjectSubmission, ProjectSubmission>(
              func(project) {
                if (project.id == projectId) { updatedSubmission } else { project };
              }
            );
            submissions.authenticatedProjects.add(submission.submittedBy, updatedUserProjects);
          };
          case (null) {};
        };

        // Send email notification
        ignore doSendDeliveryLinkNotification(submission.email, link, description);
      };
    };
  };

  func doSendDeliveryLinkNotification(recipientEmail : Text, link : Text, description : Text) : async () {
    let subject = "Leveringslenke for prosjekt hos Nebacrypt AI & Utviklingstjenester";
    let body =
      "Hei,\n\n"
      # "Her er leveringslenken for ditt prosjekt:\n\n"
      # "Lenke: " # link # "\n"
      # "Beskrivelse: " # description # "\n\n"
      # "Med vennlig hilsen,\n"
      # "Nebadon Encryption AS";

    switch (await EmailClient.sendServiceEmail("no-reply", [recipientEmail], subject, body)) {
      case (#ok) {};
      case (#err(error)) {
        Debug.print("Feil ved sending av varslings-e-post ('doSendDeliveryLinkNotification'), blir ignorert: " # error);
      };
    };
  };
};
