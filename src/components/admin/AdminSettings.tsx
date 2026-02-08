import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
}

const defaultSettings = [
  { key: 'site_title', value: '情緒 MUSCLE UP', type: 'text', description: '網站標題' },
  { key: 'site_subtitle', value: '小學生情緒能力評估', type: 'text', description: '網站副標題' },
  { key: 'welcome_message', value: '歡迎來到情緒 MUSCLE UP！讓我哋一齊探索你嘅情緒世界 🌈', type: 'textarea', description: '首頁歡迎訊息' },
  { key: 'complete_message', value: '做得好！你已經完成咗評估 🎉', type: 'textarea', description: '完成評估訊息' },
];

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setSettings(data);
      } else {
        // Initialize with defaults
        const initialSettings = defaultSettings.map(s => ({
          id: '',
          setting_key: s.key,
          setting_value: s.value,
          setting_type: s.type,
          description: s.description,
        }));
        setSettings(initialSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (setting: SiteSetting) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: setting.setting_key,
          setting_value: setting.setting_value,
          setting_type: setting.setting_type,
          description: setting.description,
        }, {
          onConflict: 'setting_key',
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving setting:', error);
      return false;
    }
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        await saveSetting(setting);
      }
      toast({
        title: '儲存成功',
        description: '所有設定已更新',
      });
    } catch (error) {
      toast({
        title: '儲存失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(s => 
      s.setting_key === key ? { ...s, setting_value: value } : s
    ));
  };

  const getSettingValue = (key: string) => {
    return settings.find(s => s.setting_key === key)?.setting_value || '';
  };

  const getSettingDescription = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    if (setting?.description) return setting.description;
    return defaultSettings.find(s => s.key === key)?.description || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">網站設定</h2>
        <Button onClick={saveAllSettings} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          儲存所有設定
        </Button>
      </div>

      <GlassCard className="p-6 space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">基本設定</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="site_title">
                {getSettingDescription('site_title')}
              </Label>
              <Input
                id="site_title"
                value={getSettingValue('site_title')}
                onChange={(e) => updateSetting('site_title', e.target.value)}
                placeholder="網站標題"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_subtitle">
                {getSettingDescription('site_subtitle')}
              </Label>
              <Input
                id="site_subtitle"
                value={getSettingValue('site_subtitle')}
                onChange={(e) => updateSetting('site_subtitle', e.target.value)}
                placeholder="網站副標題"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">訊息設定</h3>
          
          <div className="space-y-2">
            <Label htmlFor="welcome_message">
              {getSettingDescription('welcome_message')}
            </Label>
            <Textarea
              id="welcome_message"
              value={getSettingValue('welcome_message')}
              onChange={(e) => updateSetting('welcome_message', e.target.value)}
              placeholder="歡迎訊息"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complete_message">
              {getSettingDescription('complete_message')}
            </Label>
            <Textarea
              id="complete_message"
              value={getSettingValue('complete_message')}
              onChange={(e) => updateSetting('complete_message', e.target.value)}
              placeholder="完成訊息"
              rows={3}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
