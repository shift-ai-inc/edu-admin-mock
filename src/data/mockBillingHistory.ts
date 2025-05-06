import { formatISO, subMonths, addMonths, subDays, addDays } from "date-fns";

// Make this mutable for demo purposes
export const mockBillingHistory = [
  {
    id: "INV-2024-001",
    contractId: "CON-2023-001",
    issueDate: formatISO(subMonths(new Date(), 2), { representation: "date" }),
    dueDate: formatISO(subMonths(new Date(), 1), { representation: "date" }),
    amount: 200000,
    currency: "JPY",
    status: "Paid",
    cycle: "Monthly",
    paymentDate: formatISO(subDays(subMonths(new Date(), 1), 5), {
      representation: "date",
    }),
    generatedDate: formatISO(subMonths(new Date(), 2), {
      representation: "date",
    }),
    sentDate: formatISO(subMonths(new Date(), 2), { representation: "date" }),
  },
  {
    id: "INV-2024-002",
    contractId: "CON-2023-001",
    issueDate: formatISO(subMonths(new Date(), 1), { representation: "date" }),
    dueDate: formatISO(new Date(), { representation: "date" }), // Due today
    amount: 200000,
    currency: "JPY",
    status: "Unpaid",
    cycle: "Monthly",
    generatedDate: formatISO(subMonths(new Date(), 1), {
      representation: "date",
    }),
    sentDate: formatISO(subMonths(new Date(), 1), { representation: "date" }),
  },
  {
    id: "INV-2024-003",
    contractId: "CON-2023-001",
    issueDate: formatISO(new Date(), { representation: "date" }),
    dueDate: formatISO(addMonths(new Date(), 1), { representation: "date" }), // Due next month
    amount: 200000,
    currency: "JPY",
    status: "Unpaid",
    cycle: "Monthly",
    generatedDate: formatISO(new Date(), { representation: "date" }),
  },
  {
    id: "INV-2024-004",
    contractId: "CON-2023-002",
    issueDate: formatISO(subMonths(new Date(), 3), { representation: "date" }),
    dueDate: formatISO(subMonths(new Date(), 2), { representation: "date" }), // Overdue
    amount: 100000,
    currency: "JPY",
    status: "Unpaid", // Should be Overdue by logic
    cycle: "Monthly",
    generatedDate: formatISO(subMonths(new Date(), 3), {
      representation: "date",
    }),
    sentDate: formatISO(subMonths(new Date(), 3), { representation: "date" }),
  },
  {
    id: "INV-2024-005",
    contractId: "CON-2023-002",
    issueDate: formatISO(subDays(new Date(), 10), { representation: "date" }),
    dueDate: formatISO(addDays(new Date(), 5), { representation: "date" }), // Due in 5 days
    amount: 100000,
    currency: "JPY",
    status: "Unpaid",
    cycle: "Monthly",
    generatedDate: formatISO(subDays(new Date(), 10), {
      representation: "date",
    }),
  },
  {
    id: "INV-ANN-2023-001",
    contractId: "CON-2024-005", // Data Driven
    issueDate: formatISO(new Date(2024, 0, 10), { representation: "date" }), // Jan 10, 2024
    dueDate: formatISO(new Date(2024, 1, 9), { representation: "date" }), // Feb 9, 2024
    amount: 1500000,
    currency: "JPY",
    status: "Paid",
    cycle: "Annual",
    paymentDate: formatISO(new Date(2024, 1, 5), { representation: "date" }),
    generatedDate: formatISO(new Date(2024, 0, 10), { representation: "date" }),
    sentDate: formatISO(new Date(2024, 0, 10), { representation: "date" }),
  },
];
