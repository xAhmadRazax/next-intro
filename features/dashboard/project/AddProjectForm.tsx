// "use client"

// import { format } from "date-fns"
// import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   Combobox,
//   ComboboxContent,
//   ComboboxEmpty,
//   ComboboxInput,
//   ComboboxItem,
//   ComboboxList,
// } from "@/components/ui/combobox"
// import Form from "@/components/form/Form"
// import { useCompaniesQuery } from "../company/hooks/useCompaniesQuery"
// import { CompanyType, JobTitleType, PublicUserType } from "@/db/schema"
// import { DepartmentsWithRolesType } from "@/types/dashboard.types"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { Button } from "@/components/ui/button"
// import { ChevronDownIcon } from "lucide-react"
// import { useState } from "react"
// import { Calendar } from "@/components/ui/calendar"

// export const AddProjectForm = () => {
//   const [startDate, setStartDate] = useState<Date>()
//   const [endDate, setEndDate] = useState<Date>()
//   return (
//     <>
//       <DialogHeader className="text-center">
//         <DialogTitle className="mb-2 text-xl text-primary">
//           Add Employee
//         </DialogTitle>
//       </DialogHeader>

//       <Form>
//         {/* name input */}
//         <Form.Field>
//           <Form.Label>Name</Form.Label>

//           <Form.Input
//             name="name"
//             placeholder="project name"
//             required
//             disabled={false}
//             className={`${false ? "ring-1 ring-destructive" : ""}`}
//             onFocus={() => {
//               //   if (usernameError) {
//               // clearFieldError("username")
//               //   }
//             }}
//           />
//           {/* {emailError && ( */}
//           {/* <p className="text-sm text-destructive">{usernameError}</p> */}
//           {/* )} */}
//         </Form.Field>
//         {/* end of name input */}

//         <Form.Field>
//           <Form.Label>Description</Form.Label>

//           <Form.Textarea
//             className={`${false ? "ring-1 ring-destructive" : ""}`}
//             name="name"
//             placeholder="project name"
//             required
//             onFocus={() => {
//               //   if (usernameError) {
//               // clearFieldError("username")
//               //   }
//             }}
//           />

//           {/* {emailError && ( */}
//           {/* <p className="text-sm text-destructive">{usernameError}</p> */}
//           {/* )} */}
//         </Form.Field>

//         <div className="flex gap-4">
//           <Form.Field className="w-full">
//             <Form.Label>Start Date</Form.Label>

//             <Popover>
//               <PopoverTrigger
//                 render={
//                   <Button
//                     variant={"outline"}
//                     data-empty={!startDate}
//                     className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
//                   >
//                     {startDate ? (
//                       format(startDate, "PPP")
//                     ) : (
//                       <span>Pick a date</span>
//                     )}
//                     <ChevronDownIcon data-icon="inline-end" />
//                   </Button>
//                 }
//               />
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={startDate}
//                   onSelect={setStartDate}
//                   defaultMonth={startDate}
//                   disabled={{ before: new Date() }} // Disables all dates before today
//                 />
//               </PopoverContent>
//             </Popover>
//             {/* {emailError && ( */}
//             {/* <p className="text-sm text-destructive">{usernameError}</p> */}
//             {/* )} */}
//           </Form.Field>

//           <Form.Field className="w-full">
//             <Form.Label>End Date</Form.Label>

//             <Popover>
//               <PopoverTrigger
//                 render={
//                   <Button
//                     variant={"outline"}
//                     data-empty={!endDate}
//                     className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
//                   >
//                     {endDate ? (
//                       format(endDate, "PPP")
//                     ) : (
//                       <span>Pick a date</span>
//                     )}
//                     <ChevronDownIcon data-icon="inline-end" />
//                   </Button>
//                 }
//               />
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={endDate}
//                   onSelect={setEndDate}
//                   defaultMonth={endDate}
//                   disabled={{ before: new Date() }} // Disables all dates before today
//                 />
//               </PopoverContent>
//             </Popover>
//             {/* {emailError && ( */}
//             {/* <p className="text-sm text-destructive">{usernameError}</p> */}
//             {/* )} */}
//           </Form.Field>
//         </div>

//         <Form.Actions>
//           {/* <Form.Submit disabled={isCreatingEmployee}> */}
//           {/* {isCreatingEmployee ? "Adding Employee..." : "Add Employee"} */}
//           {/* </Form.Submit> */}
//         </Form.Actions>
//       </Form>
//     </>
//   )
// }
