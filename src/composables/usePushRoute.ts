import { useRouter } from 'vue-router';

export const usePushRoute = () => {
  const router = useRouter();

  const pushRoute = async (path: string) => {
    try {
      await router.push(path);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'NavigationDuplicated') {
        console.error(err);
      }
    }
  };

  return { pushRoute };
};
