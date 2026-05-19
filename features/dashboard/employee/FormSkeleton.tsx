import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FormSkeletonProps {
  title: string
  rows: number
}

export const EmployeeFormSkeleton = ({ title, rows }: FormSkeletonProps) => {
  return (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="mb-2 text-xl text-primary">{title}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        {/* Dynamically create  rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}

        <div className="mt-4 flex justify-end">
          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </>
  )
}
