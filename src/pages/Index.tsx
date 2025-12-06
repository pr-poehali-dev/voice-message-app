import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isVoice: boolean;
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: 'Анна Смирнова',
    avatar: '',
    lastMessage: 'Голосовое сообщение',
    time: '14:23',
    unread: 2,
    isVoice: true,
  },
  {
    id: 2,
    name: 'Максим Петров',
    avatar: '',
    lastMessage: 'Голосовое сообщение',
    time: '13:45',
    unread: 0,
    isVoice: true,
  },
  {
    id: 3,
    name: 'Елена Волкова',
    avatar: '',
    lastMessage: 'Голосовое сообщение',
    time: 'Вчера',
    unread: 1,
    isVoice: true,
  },
  {
    id: 4,
    name: 'Дмитрий Козлов',
    avatar: '',
    lastMessage: 'Голосовое сообщение',
    time: 'Вчера',
    unread: 0,
    isVoice: true,
  },
  {
    id: 5,
    name: 'Ольга Новикова',
    avatar: '',
    lastMessage: 'Голосовое сообщение',
    time: '21.11',
    unread: 0,
    isVoice: true,
  },
];

export default function Index() {
  const [isDark, setIsDark] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'calls' | 'profile'>('chats');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setRecordingTime(0);
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 10);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-md h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Icon name="Mic" size={20} className="text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">
              {activeTab === 'chats' && 'VoiceChat'}
              {activeTab === 'calls' && 'Звонки'}
              {activeTab === 'profile' && 'Профиль'}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full"
          >
            <Icon name={isDark ? 'Sun' : 'Moon'} size={20} />
          </Button>
        </header>

        {!selectedChat && activeTab === 'chats' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="Поиск чатов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 h-11 rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Button
                  onClick={() => setShowNewChatMenu(!showNewChatMenu)}
                  className="flex-1 h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 text-foreground border-none transition-all hover:scale-[1.02]"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <Icon name="MessageCircle" size={16} className="text-primary" />
                  </div>
                  Новый чат
                </Button>
                <Button
                  className="flex-1 h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 text-foreground border-none transition-all hover:scale-[1.02]"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <Icon name="Users" size={16} className="text-primary" />
                  </div>
                  Группа
                </Button>
              </div>

              {showNewChatMenu && (
                <div className="mb-4 p-4 bg-muted/50 rounded-2xl animate-fade-in">
                  <p className="text-sm text-muted-foreground mb-3">Создать новый чат</p>
                  <Input
                    type="text"
                    placeholder="Введите имя или номер..."
                    className="h-10 rounded-xl bg-background border-border/50"
                  />
                </div>
              )}

              <div className="space-y-2">
                {filteredChats.length === 0 && searchQuery && (
                  <div className="text-center py-12 animate-fade-in">
                    <Icon name="Search" size={48} className="mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Чаты не найдены</p>
                  </div>
                )}
                {filteredChats.map((chat, index) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted cursor-pointer transition-all hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(chat.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Mic" size={14} className="text-primary" />
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !selectedChat && activeTab === 'calls' ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Phone" size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">История звонков</h2>
              <p className="text-muted-foreground">Здесь будут ваши голосовые вызовы</p>
            </div>
          </div>
        ) : !selectedChat && activeTab === 'profile' ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col items-center mb-6 pt-4">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                  ВЫ
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-1">Ваше имя</h2>
              <p className="text-muted-foreground">+7 999 123-45-67</p>
            </div>

            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-2xl hover:bg-muted"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Icon name="User" size={18} className="text-primary" />
                </div>
                <span>Редактировать профиль</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-2xl hover:bg-muted"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Icon name="Bell" size={18} className="text-primary" />
                </div>
                <span>Уведомления</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-2xl hover:bg-muted"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Icon name="Lock" size={18} className="text-primary" />
                </div>
                <span>Приватность</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-2xl hover:bg-muted"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Icon name="Palette" size={18} className="text-primary" />
                </div>
                <span>Оформление</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-2xl hover:bg-muted"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Icon name="HelpCircle" size={18} className="text-primary" />
                </div>
                <span>Помощь</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="border-b border-border p-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(null)}
                className="rounded-full"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(mockChats.find((c) => c.id === selectedChat)?.name || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">
                  {mockChats.find((c) => c.id === selectedChat)?.name}
                </p>
                <p className="text-xs text-muted-foreground">онлайн</p>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="flex justify-end">
                <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 flex items-center gap-3 animate-scale-in">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary-foreground/20"
                  >
                    <Icon name="Play" size={16} />
                  </Button>
                  <div className="flex-1 h-8 flex items-center gap-0.5">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-primary-foreground/60 rounded-full"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs">0:15</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[70%] bg-muted rounded-2xl rounded-tl-sm p-3 flex items-center gap-3 animate-scale-in">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-background/50"
                  >
                    <Icon name="Play" size={16} />
                  </Button>
                  <div className="flex-1 h-8 flex items-center gap-0.5">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-foreground/40 rounded-full"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs">0:23</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border">
              <div className="flex flex-col items-center gap-4">
                {isRecording && (
                  <div className="w-full animate-fade-in">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <span className="text-2xl font-medium tabular-nums">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                    <div className="h-20 flex items-center justify-center gap-1">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary rounded-full transition-all duration-100"
                          style={{
                            height: `${Math.abs(Math.sin(i * 0.2 + audioLevel * 0.1)) * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {isRecording && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleStopRecording}
                      className="h-12 w-12 rounded-full animate-scale-in"
                    >
                      <Icon name="X" size={24} />
                    </Button>
                  )}

                  <div className="relative">
                    {isRecording && (
                      <>
                        <div className="absolute inset-0 bg-primary rounded-full animate-pulse-ring" />
                        <div className="absolute inset-0 bg-primary rounded-full animate-pulse-ring animation-delay-500" />
                      </>
                    )}
                    <Button
                      size="icon"
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      className={`h-16 w-16 rounded-full relative z-10 transition-all ${
                        isRecording ? 'bg-primary scale-110' : 'bg-primary'
                      }`}
                    >
                      <Icon name={isRecording ? 'Send' : 'Mic'} size={28} />
                    </Button>
                  </div>

                  {isRecording && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleStopRecording}
                      className="h-12 w-12 rounded-full animate-scale-in"
                    >
                      <Icon name="Check" size={24} className="text-primary" />
                    </Button>
                  )}
                </div>

                {!isRecording && (
                  <p className="text-sm text-muted-foreground">
                    Нажмите и удерживайте для записи
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedChat && (
          <nav className="sticky bottom-0 z-10 bg-card border-t border-border px-6 py-2 flex items-center justify-around">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('chats')}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-2xl transition-all ${
                activeTab === 'chats' ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <Icon
                name="MessageCircle"
                size={22}
                className={activeTab === 'chats' ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className={`text-xs ${
                activeTab === 'chats' ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                Чаты
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('calls')}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-2xl transition-all ${
                activeTab === 'calls' ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <Icon
                name="Phone"
                size={22}
                className={activeTab === 'calls' ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className={`text-xs ${
                activeTab === 'calls' ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                Звонки
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 rounded-2xl transition-all ${
                activeTab === 'profile' ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <Icon
                name="User"
                size={22}
                className={activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}
              />
              <span className={`text-xs ${
                activeTab === 'profile' ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                Профиль
              </span>
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}