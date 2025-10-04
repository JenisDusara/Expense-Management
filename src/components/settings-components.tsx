'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { Badge } from "./ui/badge"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function MultiLevelWorkflow() {
    const approvers = ["Manager", "Finance", "Director"];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Multi-Level Approval Flow</CardTitle>
                <CardDescription>Define the sequence of approvers for an expense claim. Drag to reorder.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {approvers.map((approver, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-md border bg-background p-3">
                            <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                            <Badge variant="secondary" className="text-sm">Step {index + 1}</Badge>
                            <span className="flex-1 font-medium">{approver}</span>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Approver Step
                </Button>
            </CardFooter>
        </Card>
    )
}

export function ConditionalApprovalRules() {
    return (
        <Card>
             <CardHeader>
                <CardTitle>Conditional Approval Rules</CardTitle>
                <CardDescription>Create hybrid rules for auto-approving expenses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="percentage-rule" className="font-semibold">Percentage Rule</Label>
                        <Switch id="percentage-rule" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">Approve if a certain percentage of approvers in the sequence have approved.</p>
                     <div className="flex items-center gap-2">
                         <Input type="number" defaultValue="60" className="w-20" />
                         <span className="text-sm font-medium">% of approvers</span>
                    </div>
                </div>

                <div className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="specific-rule" className="font-semibold">Specific Approver Rule</Label>
                        <Switch id="specific-rule" />
                    </div>
                    <p className="text-sm text-muted-foreground">Auto-approve if a specific person approves, regardless of the sequence.</p>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Select an approver role" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cfo">CFO</SelectItem>
                            <SelectItem value="director">Director</SelectItem>
                            <SelectItem value="ceo">CEO</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <Button>Save Rules</Button>
            </CardFooter>
        </Card>
    )
}
