export interface ISalaryPayment {
    id: number;
    userId: number;
    month: number;
    year: number;
    salary: number;
    status: 'Pending' | 'Paid';
    paidDate?: Date | null;
    paidBy?: number | null;
    remarks?: string | null;
    baseSalary?: number | null;
    lopDays?: number | null;
    wfhDeductionDays?: number | null;
    deductionAmount?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}