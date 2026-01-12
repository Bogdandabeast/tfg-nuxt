import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive, ref } from "vue";
import { z } from "zod";

export function useSettings() {
  const fileRef = ref<HTMLInputElement>();

  const profileSchema = z.object({
    name: z.string().min(2, "Too short"),
    email: z.string().email("Invalid email"),
    username: z.string().min(2, "Too short"),
    avatar: z.string().optional(),
    bio: z.string().optional(),
  });

  type ProfileSchema = z.output<typeof profileSchema>;

  const profile = reactive<Partial<ProfileSchema>>({
    name: "Benjamin Canac",
    email: "ben@nuxtlabs.com",
    username: "benjamincanac",
    avatar: undefined,
    bio: undefined,
  });
  const toast = useToast();
  async function onSubmit(_event: FormSubmitEvent<ProfileSchema>) {
    toast.add({
      title: "Success",
      description: "Your settings have been updated.",
      icon: "i-lucide-check",
      color: "success",
    });
  }

  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    profile.avatar = URL.createObjectURL(input.files[0]!);
  }

  function onFileClick() {
    fileRef.value?.click();
  }

  return {
    fileRef,
    profileSchema,
    profile,
    onSubmit,
    onFileChange,
    onFileClick,
  };
}
