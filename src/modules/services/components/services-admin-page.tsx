import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicesAdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Services Section</h1>
      <Card>
        <CardHeader>
          <CardTitle>Services Content</CardTitle>
          <CardDescription>
            Editing for the services section is not yet implemented. Data is currently managed in the mock database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This page will contain a form to add, edit, and delete services.</p>
        </CardContent>
      </Card>
    </div>
  );
}
