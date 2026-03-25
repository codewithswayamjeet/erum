import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings2, Save, Loader2 } from 'lucide-react';

const AdminSettings = () => {
  const [conversionRate, setConversionRate] = useState('94.25');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'usd_to_inr_rate')
        .single();
      if (data?.value) setConversionRate(data.value);
      setFetching(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const rate = parseFloat(conversionRate);
    if (isNaN(rate) || rate <= 0) {
      toast({ title: 'Invalid Rate', description: 'Please enter a valid conversion rate.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Try update first
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'usd_to_inr_rate')
        .single();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: rate.toString(), updated_at: new Date().toISOString() })
          .eq('key', 'usd_to_inr_rate');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({ key: 'usd_to_inr_rate', value: rate.toString() });
        if (error) throw error;
      }

      toast({ title: 'Saved', description: `Conversion rate updated to 1 USD = ₹${rate}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Site Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Currency Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">USD to INR Rate</label>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">1 USD =</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  disabled={fetching}
                  className="w-32 px-4 py-2 border border-border bg-secondary focus:border-primary focus:outline-none rounded-sm"
                />
                <span className="text-muted-foreground">INR</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This rate is used when customers toggle to INR on the website.
              </p>
            </div>
            <Button onClick={handleSave} disabled={loading || fetching}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Rate
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
