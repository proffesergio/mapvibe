import { Card, SectionTitle } from "@/components/ui/Card";
import { AvatarUploader } from "@/components/avatar/AvatarUploader";

/** Shared Step 3 block used by every feature page. */
export function AvatarCard() {
  return (
    <Card>
      <SectionTitle
        emoji="📷"
        title="প্রোফাইল ছবি দাও"
        desc="ছবি তোমার ফোনেই থাকে — সার্ভারে আপলোড হয় না। Google/Facebook লগইনও আছে।"
      />
      <AvatarUploader />
    </Card>
  );
}
