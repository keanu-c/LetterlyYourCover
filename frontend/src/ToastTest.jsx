import { Button } from "@/components/ui/button"
import { toaster } from "@/components/ui/toaster"

const ToastTest = () => {
  return (
    <Button
      onClick={() =>
        toaster.create({
          title: 'Test Toast',
          description: "This is a test toast message!",
        })
      }
    >
      Show Toast
    </Button>
  );
};

export default ToastTest;