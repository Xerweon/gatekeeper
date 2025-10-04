import StaffCard from "./staff-card"
import type { Staff } from "@/types/user.type"

export default function StaffGridView({
  staff,
  onCheckIn
}: {
  staff: Staff[] | null | undefined
  onCheckIn: (staffId: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
      {staff?.map((member) => (
        <StaffCard key={member.email} staff={member} onCheckIn={onCheckIn} />
      ))}
           
    </div>
  )
}