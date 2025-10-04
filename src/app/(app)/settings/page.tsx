import { PageHeader } from "@/components/page-header";
import { ConditionalApprovalRules, MultiLevelWorkflow } from "@/components/settings-components";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
             <PageHeader
                title="Settings"
                description="Configure approval workflows, roles, and integrations."
            />
            <div className="grid gap-8 lg:grid-cols-2">
                <MultiLevelWorkflow />
                <ConditionalApprovalRules />
            </div>
        </div>
    )
}
