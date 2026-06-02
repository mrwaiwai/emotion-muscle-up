import { useEffect, useState } from 'react';
import { KeyRound, Plus, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TeacherRow {
  id: string;
  display_name: string;
  email: string;
  created_at: string;
  schools?: { name: string } | null;
}

export function AdminTeacherAccounts() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    setListLoading(true);
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('id, display_name, email, created_at, schools(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers((data || []) as TeacherRow[]);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-teacher', {
        body: {
          displayName,
          email,
          password,
          schoolName,
        },
      });

      if (error || data?.error) throw new Error(error?.message || data.error);

      toast({
        title: '老師帳號已建立',
        description: `${displayName} 可以登入老師工作台`,
      });
      setDisplayName('');
      setEmail('');
      setPassword('');
      setSchoolName('');
      fetchTeachers();
    } catch (error: any) {
      toast({
        title: '建立失敗',
        description: error.message || '請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">老師帳號</h2>
        <p className="text-sm text-muted-foreground">建立前台老師登入帳號，並綁定所屬學校</p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="teacher-name">老師名稱</Label>
            <Input id="teacher-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacher-school">學校</Label>
            <Input id="teacher-school" value={schoolName} onChange={(event) => setSchoolName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacher-email">帳號電郵</Label>
            <Input id="teacher-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacher-password">密碼</Label>
            <Input id="teacher-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              {loading ? '建立中...' : '建立 / 更新老師帳號'}
            </Button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            已建立帳號
          </h3>
          <Button variant="outline" size="sm" onClick={fetchTeachers} disabled={listLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${listLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
        {teachers.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">暫無老師帳號</p>
        ) : (
          <div className="space-y-3">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="p-4 rounded-lg bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{teacher.display_name}</p>
                  <p className="text-sm text-muted-foreground">{teacher.email}</p>
                </div>
                <p className="text-sm font-medium">{teacher.schools?.name || '-'}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
