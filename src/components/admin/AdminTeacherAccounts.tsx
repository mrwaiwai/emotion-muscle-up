import { useEffect, useState } from 'react';
import { Copy, KeyRound, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TeacherRow {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  created_at: string;
  schools?: { name: string } | null;
}

const formatTeacherInfo = (teacher: TeacherRow) => [
  `老師名稱：${teacher.display_name}`,
  `帳號電郵：${teacher.email}`,
  `學校名稱：${teacher.schools?.name || '-'}`,
].join('\n');

export function AdminTeacherAccounts() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    setListLoading(true);
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('id, user_id, display_name, email, created_at, schools(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeachers((data || []) as TeacherRow[]);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setListLoading(false);
    }
  };

  const copyTeacherInfo = async (teacher: TeacherRow) => {
    try {
      await navigator.clipboard.writeText(formatTeacherInfo(teacher));
      toast({
        title: '已複製帳戶資料',
        description: `${teacher.display_name} 的資料已放入剪貼簿`,
      });
    } catch (error) {
      toast({
        title: '複製失敗',
        description: '請手動選取資料複製',
        variant: 'destructive',
      });
    }
  };

  const deleteTeacher = async (teacher: TeacherRow) => {
    setDeletingTeacherId(teacher.id);

    try {
      const { data, error } = await supabase.functions.invoke('delete-teacher', {
        body: { teacherUserId: teacher.user_id },
      });

      if (error || data?.error) throw new Error(error?.message || data.error);

      toast({
        title: '老師帳號已刪除',
        description: `${teacher.display_name} 已不能再登入老師工作台`,
      });
      fetchTeachers();
    } catch (error: any) {
      const { error: fallbackError } = await supabase
        .from('teacher_profiles')
        .delete()
        .eq('id', teacher.id);

      if (!fallbackError) {
        toast({
          title: '老師帳號已移除',
          description: `${teacher.display_name} 已不能再進入老師工作台`,
        });
        fetchTeachers();
        setDeletingTeacherId(null);
        return;
      }

      toast({
        title: '刪除失敗',
        description: fallbackError.message || error.message || '請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setDeletingTeacherId(null);
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
              <div key={teacher.id} className="p-4 rounded-lg bg-muted/30 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="grid flex-1 gap-2 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">老師名稱</p>
                    <p className="font-medium">{teacher.display_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">帳號電郵</p>
                    <p className="break-all text-sm font-medium">{teacher.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">學校名稱</p>
                    <p className="text-sm font-medium">{teacher.schools?.name || '-'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={() => copyTeacherInfo(teacher)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy and Paste
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" size="sm" disabled={deletingTeacherId === teacher.id}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        刪除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>刪除老師帳號？</AlertDialogTitle>
                        <AlertDialogDescription>
                          這會刪除 {teacher.display_name} 的登入帳號，老師之後不能再登入工作台。既有學生評估記錄會保留。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => deleteTeacher(teacher)}
                        >
                          確認刪除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
