
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy } from "lucide-react"

interface TopRatedStudentsCardProps {
  students: {
    name: string;
    codeforcesHandle: string;
    currentRating: number;
  }[];
}

export function TopRatedStudentsCard({ students }: TopRatedStudentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Top Rated Students
        </CardTitle>
        <CardDescription>
          The students with the highest current ratings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.codeforcesHandle}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{student.currentRating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
