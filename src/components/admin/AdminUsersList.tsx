import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, Download, Trash2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type AssessmentSession = Tables<'assessment_sessions'>;
type AssessmentAnswer = Tables<'assessment_answers'>;

export function AdminUsersList() {
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<AssessmentSession | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<AssessmentAnswer[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (session: AssessmentSession) => {
    setSelectedSession(session);
    setShowDetails(true);

    try {
      const { data, error } = await supabase
        .from('assessment_answers')
        .select('*')
        .eq('session_id', session.id)
        .order('answered_at', { ascending: true });

      if (error) throw error;
      setSessionAnswers(data || []);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('確定要刪除此評估記錄？')) return;

    try {
      const { error } = await supabase
        .from('assessment_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['學生姓名', '班級', '學校', '語言', '辨別', '理解', '標記', '表達', '調節', '總分', '完成時間'];
    const rows = sessions.map(s => [
      s.student_name,
      s.student_class || '',
      s.school_name || '',
      s.language || 'zh',
      s.score_recognizing || 0,
      s.score_understanding || 0,
      s.score_labeling || 0,
      s.score_expressing || 0,
      s.score_regulating || 0,
      s.total_score || 0,
      s.completed_at ? new Date(s.completed_at).toLocaleString('zh-HK') : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `assessment_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredSessions = sessions.filter(s =>
    s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const skillLabels: Record<string, string> = {
    recognizing: '辨別',
    understanding: '理解',
    labeling: '標記',
    expressing: '表達',
    regulating: '調節',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">用戶數據</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋學生、學校..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            匯出 CSV
          </Button>
        </div>
      </div>

      <GlassCard className="p-6">
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">載入中...</p>
        ) : filteredSessions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">暫無評估記錄</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>學生姓名</TableHead>
                  <TableHead>班級</TableHead>
                  <TableHead>學校</TableHead>
                  <TableHead>總分</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.student_name}</TableCell>
                    <TableCell>{session.student_class || '-'}</TableCell>
                    <TableCell>{session.school_name || '-'}</TableCell>
                    <TableCell>
                      {session.total_score !== null ? `${session.total_score}%` : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        session.completed_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.completed_at ? '已完成' : '進行中'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(session.created_at).toLocaleString('zh-HK')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchSessionDetails(session)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSession(session.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </GlassCard>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>評估詳情 - {selectedSession?.student_name}</DialogTitle>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">班級</p>
                  <p className="font-medium">{selectedSession.student_class || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">學校</p>
                  <p className="font-medium">{selectedSession.school_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">用時</p>
                  <p className="font-medium">
                    {selectedSession.duration_seconds 
                      ? `${Math.floor(selectedSession.duration_seconds / 60)}分${selectedSession.duration_seconds % 60}秒`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">總分</p>
                  <p className="font-medium text-primary">
                    {selectedSession.total_score !== null ? `${selectedSession.total_score}%` : '-'}
                  </p>
                </div>
              </div>

              {/* Skill Scores */}
              <div>
                <h4 className="font-semibold mb-3">技能分數</h4>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: 'recognizing', score: selectedSession.score_recognizing },
                    { key: 'understanding', score: selectedSession.score_understanding },
                    { key: 'labeling', score: selectedSession.score_labeling },
                    { key: 'expressing', score: selectedSession.score_expressing },
                    { key: 'regulating', score: selectedSession.score_regulating },
                  ].map((skill) => (
                    <div key={skill.key} className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">{skillLabels[skill.key]}</p>
                      <p className="text-lg font-bold">{skill.score ?? '-'}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer Details */}
              <div>
                <h4 className="font-semibold mb-3">答題記錄</h4>
                {sessionAnswers.length === 0 ? (
                  <p className="text-muted-foreground text-sm">暫無答題記錄</p>
                ) : (
                  <div className="space-y-2">
                    {sessionAnswers.map((answer, index) => (
                      <div key={answer.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Q{index + 1}: {answer.question_text}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              答案: {answer.selected_option_text}
                            </p>
                          </div>
                          <span className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
                            answer.score === 3 
                              ? 'bg-green-100 text-green-800'
                              : answer.score === 2
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {answer.score}/{answer.max_score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
