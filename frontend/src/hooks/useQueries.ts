import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ProjectStatus } from '../backend';
import type { ProjectSubmission, UserProfile, ProjectBudgetRange, ExternalBlob } from '../backend';

// Helper function to refresh project-related queries
async function refreshProjectQueries(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.invalidateQueries({ queryKey: ['submissions'] });
  await queryClient.invalidateQueries({ queryKey: ['userProjects'] });
  await queryClient.invalidateQueries({ queryKey: ['allUserMessages'] });
  await queryClient.invalidateQueries({ queryKey: ['allMessages'] });
  await Promise.all([
    queryClient.refetchQueries({ queryKey: ['submissions'], type: 'active' }),
    queryClient.refetchQueries({ queryKey: ['userProjects'], type: 'active' }),
    queryClient.refetchQueries({ queryKey: ['allUserMessages'], type: 'active' }),
    queryClient.refetchQueries({ queryKey: ['allMessages'], type: 'active' }),
  ]);
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(['currentUserProfile'], profile);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(['currentUserProfile'], profile);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(['currentUserProfile'], profile);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitProject() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      clientName: string;
      companyName: string;
      email: string;
      projectDescription: string;
      timeline: string;
      budget: ProjectBudgetRange;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitProject(
        data.clientName,
        data.companyName,
        data.email,
        data.projectDescription,
        data.timeline,
        data.budget
      );
    },
  });
}

export function useSubmitAuthenticatedProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      clientName: string;
      companyName: string;
      email: string;
      projectDescription: string;
      timeline: string;
      budget: ProjectBudgetRange;
      files: ExternalBlob[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAuthenticatedProject(
        data.clientName,
        data.companyName,
        data.email,
        data.projectDescription,
        data.timeline,
        data.budget,
        data.files
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      await queryClient.refetchQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function useGetUserProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<ProjectSubmission[]>({
    queryKey: ['userProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserProjects();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useGetAllSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<ProjectSubmission[]>({
    queryKey: ['submissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

// Generic hook for marking project status
export function useMarkProjectStatus(status: ProjectStatus) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, comment }: { projectId: bigint; comment: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      
      switch (status) {
        case ProjectStatus.reviewed:
          return actor.markAsReviewed(projectId, comment);
        case ProjectStatus.followup:
          return actor.markAsFollowup(projectId, comment);
        case ProjectStatus.inProgress:
          return actor.markAsInProgress(projectId, comment);
        case ProjectStatus.completed:
          return actor.markAsCompleted(projectId, comment);
        default:
          throw new Error(`Unknown status: ${status}`);
      }
    },
    onSuccess: async () => {
      await refreshProjectQueries(queryClient);
    },
  });
}

// Legacy hooks for backward compatibility - delegate to generic hook
export function useMarkAsReviewed() {
  return useMarkProjectStatus(ProjectStatus.reviewed);
}

export function useMarkAsFollowup() {
  return useMarkProjectStatus(ProjectStatus.followup);
}

export function useMarkAsInProgress() {
  return useMarkProjectStatus(ProjectStatus.inProgress);
}

export function useMarkAsCompleted() {
  return useMarkProjectStatus(ProjectStatus.completed);
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, sender, text }: { projectId: bigint; sender: string; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(projectId, sender, text);
    },
    onSuccess: async () => {
      await refreshProjectQueries(queryClient);
    },
  });
}

export function useAddDeliveryLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, link, description }: { projectId: bigint; link: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDeliveryLink(projectId, link, description);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['submissions'] });
      await queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['submissions'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['userProjects'], type: 'active' }),
      ]);
    },
  });
}

export function useGetAllUserMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Array<{ sender: string; timestamp: bigint; text: string }>]>>({
    queryKey: ['allUserMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserMessages();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Array<{ sender: string; timestamp: bigint; text: string }>]>>({
    queryKey: ['allMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const result = await actor.isCallerAdmin();
        return result;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
