// components/forms/SubmitButton.tsx
import { Button } from "@/components/ui/button"
import { Spinner } from "../ui/spinner"

interface SubmitButtonProps {
  children?: React.ReactNode
  isLoading?: boolean
  loadingText?: string
}

export const SubmitButton = ({
  children = "Submit",
  isLoading = false,
  loadingText = "loading..",
}: SubmitButtonProps) => {
  return (
    <div className="mt-4 flex justify-end">
      <Button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer rounded-sm bg-green-600 px-4 py-2 text-green-50 transition-colors hover:bg-green-600/80 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            {loadingText}
            <Spinner />
          </>
        ) : (
          children
        )}
      </Button>
    </div>
  )
}
