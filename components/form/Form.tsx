import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Root({ children, ...props }: React.ComponentProps<"form">) {
  return (
    <form className="flex flex-col gap-4" {...props}>
      {children}
    </form>
  )
}

function Title({ children }: React.PropsWithChildren) {
  return <h2 className="text-xl font-semibold text-primary">{children}</h2>
}

function Field({
  children,
  className,
  ...props
}: React.PropsWithChildren<
  { className?: string } & React.HTMLAttributes<HTMLDivElement>
>) {
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-2", className ? className : "")}
    >
      {children}
    </div>
  )
}

function FormLabel({ children, ...props }: React.ComponentProps<typeof Label>) {
  return <Label {...props}>{children}</Label>
}

function FormInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} />
}

function Actions({ children }: React.PropsWithChildren) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>
}

function Submit({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button type="submit" {...props}>
      {children}
    </Button>
  )
}
const Form = Object.assign(Root, {
  Title,
  Field,
  Label: FormLabel,
  Input: FormInput,
  Actions,
  Submit,
})

export default Form
