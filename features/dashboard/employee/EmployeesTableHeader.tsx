import DataTable from "../components/DataTable"

export function EmployeesTableHeader() {
  return (
    <DataTable.Header>
      <DataTable.Column className="min-w-15">No.</DataTable.Column>
      <DataTable.Column className="min-w-62.5">Email</DataTable.Column>
      <DataTable.Column className="min-w-37.5">Name</DataTable.Column>
      <DataTable.Column className="min-w-15">Company</DataTable.Column>
      <DataTable.Column className="min-w-20">Age</DataTable.Column>
      <DataTable.Column className="min-w-20">Last Login</DataTable.Column>
      <DataTable.Column className="w-15 text-center">Actions</DataTable.Column>
    </DataTable.Header>
  )
}
