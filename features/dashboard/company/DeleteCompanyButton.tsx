"use client"
import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import type { CompanyType } from "@/types/dashboard.types"
import { useDeleteCompanyMutation } from "./hooks/useDeleteCompanyMutation"
import { companyKeys } from "@/lib/queryKeys"
import { useSearchParams } from "next/navigation"

interface DeleteCompanyButtonProps {
  id: string
  name?: string // Optional: show company name in confirmation
}

export const DeleteCompanyButton = ({ id, name }: DeleteCompanyButtonProps) => {
  const searchParams = useSearchParams()
  const page = Number(searchParams?.get("page") ?? 1)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { deleteCompanyMutation, isLoading } = useDeleteCompanyMutation(id)

  const handleDelete = () => {
    deleteCompanyMutation(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: companyKeys.all,
        })
        queryClient.setQueryData(
          companyKeys.page(page),
          (old: { data: CompanyType[] }) => ({
            ...old,
            data: old.data.filter((u) => u.id !== id),
          })
        )
        queryClient.invalidateQueries({ queryKey: companyKeys.all })
        setOpen(false) // Close dialog on success
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        Delete
      </DialogTrigger>

      <DialogContent className="px-6 text-foreground/80">
        <DialogHeader>
          <DialogTitle>Delete Company</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {name ? `"${name}"` : "this company"}? This action cannot be undone
            and will permanently remove the company&apos;s data from the system.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
