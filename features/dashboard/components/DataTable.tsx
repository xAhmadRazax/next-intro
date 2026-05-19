"use client"
import { Button } from "@/components/ui/button"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DataTableContext,
  useDataTable,
  type DataTableContextType,
} from "../hooks/useDataTable"
import { RotateCw } from "lucide-react"

type DataTableProps = React.PropsWithChildren<DataTableContextType>
type ColumnProps = React.PropsWithChildren<{
  className?: string
}>

function Root({ children, isLoading, isFetching, onRefresh }: DataTableProps) {
  return (
    <DataTableContext.Provider
      value={{
        isLoading,
        isFetching,
        onRefresh,
      }}
    >
      <div className="w-full max-w-screen min-w-0 overflow-x-auto rounded-sm border bg-card shadow-sm md:max-w-[calc(100vw-250px)]">
        <Table>{children}</Table>
      </div>
    </DataTableContext.Provider>
  )
}

function Header({ children }: React.PropsWithChildren) {
  const { isFetching, isLoading, onRefresh } = useDataTable()

  return (
    <TableHeader>
      <TableRow className="border-b bg-muted hover:bg-muted/80">
        {children}

        <TableHead className="w-15 text-center">
          <Button
            variant="default"
            size="icon"
            disabled={isFetching || isLoading}
            className={`rounded-full p-0 ${
              isFetching || isLoading ? "animate-spin" : ""
            }`}
            onClick={onRefresh}
          >
            <RotateCw className="size-4" />
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}

function Column({ children, className }: ColumnProps) {
  return (
    <TableHead className={`font-semibold text-foreground ${className}`}>
      {children}
    </TableHead>
  )
}

function Body({ children }: React.PropsWithChildren) {
  return children
}

const DataTable = Object.assign(Root, {
  Header,
  Column,
  Body,
})

export default DataTable
