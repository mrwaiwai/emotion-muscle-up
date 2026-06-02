import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit, Save, X, Video, Upload, Play, Eye } from 'lucide-react';
import { questions as defaultQuestions, Question } from '@/data/questions';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type QuestionConfig = Tables<'questions_config'>;

interface EditableQuestion extends Question {
  dbId?: string;
}

export function AdminQuestionsList() {
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<EditableQuestion | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions_config')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const dbQuestions: EditableQuestion[] = data.map((q) => ({
          dbId: q.id,
          id: q.question_id,
          type: 'scenario' as const,
          skill: q.skill_type as any,
          questionText: q.question_text,
          questionTextEn: q.question_text_en || undefined,
          icon: q.icon || undefined,
          videoUrl: q.video_url || undefined,
          options: q.options as any,
        }));

        const dbQuestionsById = new Map(dbQuestions.map((q) => [q.id, q]));
        const defaultQuestionsWithDbOverrides = defaultQuestions.map((q) => ({
          ...q,
          ...dbQuestionsById.get(q.id),
        }));
        const customDbQuestions = dbQuestions.filter(
          (q) => !defaultQuestions.some((defaultQuestion) => defaultQuestion.id === q.id)
        );

        setQuestions([...defaultQuestionsWithDbOverrides, ...customDbQuestions]);
      } else {
        // Initialize from default questions
        setQuestions(defaultQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions(defaultQuestions);
    } finally {
      setLoading(false);
    }
  };

  const saveQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const questionData = {
        question_id: editingQuestion.id,
        question_text: editingQuestion.questionText,
        question_text_en: editingQuestion.questionTextEn || null,
        skill_type: editingQuestion.skill,
        icon: editingQuestion.icon || null,
        video_url: editingQuestion.videoUrl || null,
        options: JSON.parse(JSON.stringify(editingQuestion.options)),
        display_order: questions.findIndex(q => q.id === editingQuestion.id) + 1,
        is_active: true,
      };

      if (editingQuestion.dbId) {
        // Update existing
        const { error } = await supabase
          .from('questions_config')
          .update(questionData)
          .eq('id', editingQuestion.dbId);

        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('questions_config')
          .insert([questionData])
          .select()
          .single();

        if (error) throw error;
        editingQuestion.dbId = data.id;
      }

      setQuestions(questions.map(q => 
        q.id === editingQuestion.id ? editingQuestion : q
      ));
      setShowEditDialog(false);
      setEditingQuestion(null);

      toast({
        title: '儲存成功',
        description: '題目已更新',
      });
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: '儲存失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
    }
  };

  const syncAllQuestions = async () => {
    try {
      // Sync all default questions to database
      for (let i = 0; i < defaultQuestions.length; i++) {
        const q = defaultQuestions[i];
        const { error } = await supabase
          .from('questions_config')
          .upsert([{
            question_id: q.id,
            question_text: q.questionText,
            question_text_en: q.questionTextEn || null,
            skill_type: q.skill,
            icon: q.icon || null,
            video_url: q.videoUrl || null,
            options: JSON.parse(JSON.stringify(q.options)),
            display_order: i + 1,
            is_active: true,
          }], {
            onConflict: 'question_id',
          });

        if (error) throw error;
      }

      toast({
        title: '同步成功',
        description: '所有題目已同步到數據庫',
      });

      fetchQuestions();
    } catch (error) {
      console.error('Error syncing questions:', error);
      toast({
        title: '同步失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
    }
  };

  const skillLabels: Record<string, string> = {
    recognizing: '辨別',
    understanding: '理解',
    labeling: '標記',
    expressing: '表達',
    regulating: '調節',
  };

  const skillColors: Record<string, string> = {
    recognizing: 'bg-blue-100 text-blue-800',
    understanding: 'bg-purple-100 text-purple-800',
    labeling: 'bg-green-100 text-green-800',
    expressing: 'bg-orange-100 text-orange-800',
    regulating: 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">題目管理</h2>
        <Button onClick={syncAllQuestions}>
          <Upload className="w-4 h-4 mr-2" />
          同步預設題目
        </Button>
      </div>

      <GlassCard className="p-6">
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">載入中...</p>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 bg-muted/30 rounded-lg flex items-start gap-4"
              >
                <span className="text-2xl shrink-0">{question.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Q{index + 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${skillColors[question.skill]}`}>
                      {skillLabels[question.skill]}
                    </span>
                    {question.videoUrl && (
                      <button
                        onClick={() => setPreviewVideoUrl(question.videoUrl!)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        預覽影片
                      </button>
                    )}
                  </div>
                  <p className="font-medium">{question.questionText}</p>
                  {question.questionTextEn && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.questionTextEn}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingQuestion({ ...question });
                    setShowEditDialog(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯題目</DialogTitle>
          </DialogHeader>

          {editingQuestion && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>題目（中文）</Label>
                <Textarea
                  value={editingQuestion.questionText}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    questionText: e.target.value,
                  })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>題目（英文）</Label>
                <Textarea
                  value={editingQuestion.questionTextEn || ''}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    questionTextEn: e.target.value,
                  })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>圖示 (Emoji)</Label>
                  <Input
                    value={editingQuestion.icon || ''}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      icon: e.target.value,
                    })}
                    placeholder="🎯"
                  />
                </div>

                <div className="space-y-2">
                  <Label>影片網址</Label>
                  <div className="flex gap-2">
                    <Input
                      value={editingQuestion.videoUrl || ''}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion,
                        videoUrl: e.target.value,
                      })}
                      placeholder="/videos/q1.mp4"
                      className="flex-1"
                    />
                    {editingQuestion.videoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setPreviewVideoUrl(editingQuestion.videoUrl!)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Inline video preview in edit dialog */}
                  {editingQuestion.videoUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden bg-muted/50">
                      <video
                        key={editingQuestion.videoUrl}
                        src={editingQuestion.videoUrl}
                        className="w-full max-h-48 object-contain"
                        controls
                        muted
                      >
                        你的瀏覽器不支援影片播放
                      </video>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>答案選項</Label>
                {editingQuestion.options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <Input
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options];
                        newOptions[index] = { ...option, text: e.target.value };
                        setEditingQuestion({
                          ...editingQuestion,
                          options: newOptions,
                        });
                      }}
                      placeholder="中文答案"
                      className="flex-1"
                    />
                    <Input
                      value={option.textEn || ''}
                      onChange={(e) => {
                        const newOptions = [...editingQuestion.options];
                        newOptions[index] = { ...option, textEn: e.target.value };
                        setEditingQuestion({
                          ...editingQuestion,
                          options: newOptions,
                        });
                      }}
                      placeholder="English"
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {option.score}分
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingQuestion(null);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  取消
                </Button>
                <Button onClick={saveQuestion}>
                  <Save className="w-4 h-4 mr-2" />
                  儲存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Preview Dialog */}
      <Dialog open={!!previewVideoUrl} onOpenChange={() => setPreviewVideoUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              影片預覽
            </DialogTitle>
          </DialogHeader>
          {previewVideoUrl && (
            <div className="rounded-lg overflow-hidden bg-black">
              <video
                key={previewVideoUrl}
                src={previewVideoUrl}
                className="w-full max-h-[60vh] object-contain"
                controls
                autoPlay
                muted
              >
                你的瀏覽器不支援影片播放
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
