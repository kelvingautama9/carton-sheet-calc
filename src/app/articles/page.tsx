import articles from '@/data/data_artikel.json';
import { DataTable } from './data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArticlesPage() {
  return (
    <div className="animate-in fade-in duration-500">
        <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
            <CardTitle className="text-2xl">Articles</CardTitle>
            <CardDescription>
            A list of all available carton sheet articles. Use the search box to filter.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <DataTable data={articles} />
        </CardContent>
        </Card>
    </div>
  );
}
