
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { 
  Bell, 
  MessageCircle, 
  Users, 
  Calendar, 
  Trophy, 
  AlertCircle, 
  Check, 
  Trash2, 
  X,
  Settings,
  Filter,
  CheckCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

// Mock notifications data
const notificationsData = [
  {
    id: 1,
    type: 'match',
    message: 'Mumbai Indians vs Chennai Super Kings match starts in 1 hour!',
    date: '2023-09-10T15:30:00Z',
    read: false,
    actionUrl: '/match/1'
  },
  {
    id: 2,
    type: 'player',
    message: 'Virat Kohli scored a century in the RCB vs KKR match!',
    date: '2023-09-09T18:45:00Z',
    read: true,
    actionUrl: '/players/1'
  },
  {
    id: 3,
    type: 'tournament',
    message: 'Mumbai Premier League semi-finals schedule announced.',
    date: '2023-09-08T10:15:00Z',
    read: false,
    actionUrl: '/tournament?id=1'
  },
  {
    id: 4,
    type: 'system',
    message: 'Welcome to CricketVerse! Complete your profile to get personalized updates.',
    date: '2023-09-07T09:30:00Z',
    read: true,
    actionUrl: '/profile'
  },
  {
    id: 5,
    type: 'match',
    message: 'The match between Kolkata Knight Riders and Delhi Capitals has been delayed due to rain.',
    date: '2023-09-06T14:20:00Z',
    read: false,
    actionUrl: '/match/2'
  },
  {
    id: 6,
    type: 'player',
    message: 'MS Dhoni announced as the brand ambassador for Chennai Super Kings new campaign.',
    date: '2023-09-05T11:10:00Z',
    read: true,
    actionUrl: '/players/2'
  },
  {
    id: 7,
    type: 'system',
    message: 'App updated to version 2.0 with new features and improvements.',
    date: '2023-09-04T16:45:00Z',
    read: false,
    actionUrl: '#'
  }
];

// Mock chat messages
const conversations = [
  {
    id: 1,
    with: 'John Smith',
    avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF/png?text=JS',
    lastMessage: 'Did you see that last over? Incredible finish!',
    date: '2023-09-10T16:30:00Z',
    unread: 2
  },
  {
    id: 2,
    with: 'Cricket Fans Group',
    avatar: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=CFG',
    lastMessage: 'Anyone watching the Mumbai match today?',
    date: '2023-09-09T10:15:00Z',
    unread: 0,
    isGroup: true,
    members: 24
  },
  {
    id: 3,
    with: 'Sarah Johnson',
    avatar: 'https://placehold.co/100x100/EF4444/FFFFFF/png?text=SJ',
    lastMessage: 'I think RCB will win this season!',
    date: '2023-09-08T20:45:00Z',
    unread: 0
  },
  {
    id: 4,
    with: 'Mumbai Indians Fan Club',
    avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF/png?text=MI',
    lastMessage: 'Welcome to the group! We discuss all MI matches here.',
    date: '2023-09-07T14:20:00Z',
    unread: 5,
    isGroup: true,
    members: 156
  }
];

// Mock chat detail for conversation 1
const chatDetail = [
  {
    id: 1,
    sender: 'John Smith',
    avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF/png?text=JS',
    message: 'Hey! Are you watching the match today?',
    date: '2023-09-10T15:30:00Z',
    isUser: false
  },
  {
    id: 2,
    sender: 'You',
    message: 'Yes, just tuned in. MI is batting first!',
    date: '2023-09-10T15:32:00Z',
    isUser: true
  },
  {
    id: 3,
    sender: 'John Smith',
    avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF/png?text=JS',
    message: 'Great start by Rohit Sharma. Already hit two sixes!',
    date: '2023-09-10T15:35:00Z',
    isUser: false
  },
  {
    id: 4,
    sender: 'You',
    message: 'Yeah, he\'s in great form today. What do you think will be a good score on this pitch?',
    date: '2023-09-10T15:38:00Z',
    isUser: true
  },
  {
    id: 5,
    sender: 'John Smith',
    avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF/png?text=JS',
    message: 'I think anything above 180 will be tough to chase. The pitch seems a bit slow.',
    date: '2023-09-10T15:42:00Z',
    isUser: false
  },
  {
    id: 6,
    sender: 'John Smith',
    avatar: 'https://placehold.co/100x100/3B82F6/FFFFFF/png?text=JS',
    message: 'Did you see that last over? Incredible finish!',
    date: '2023-09-10T16:30:00Z',
    isUser: false
  }
];

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(notificationsData);
  const [filterType, setFilterType] = useState('all');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
    
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
      duration: 3000,
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read.",
      duration: 3000,
    });
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared.",
      duration: 3000,
    });
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.read;
    return notification.type === filterType;
  });
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to the backend
    toast({
      title: "Message Sent",
      description: "Your message has been sent.",
      duration: 2000,
    });
    
    setNewMessage('');
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Trophy className="w-4 h-4" />;
      case 'player':
        return <Users className="w-4 h-4" />;
      case 'tournament':
        return <Calendar className="w-4 h-4" />;
      case 'system':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full animate-spin"></div>
            <Bell className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="notifications" className="text-sm flex items-center">
            <Bell className="w-4 h-4 mr-2" /> 
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="text-sm flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" /> 
            Messages
            {conversations.reduce((acc, conv) => acc + conv.unread, 0) > 0 && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                {conversations.reduce((acc, conv) => acc + conv.unread, 0)}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input py-1 text-sm"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="match">Matches</option>
                  <option value="player">Players</option>
                  <option value="tournament">Tournaments</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div className="flex flex-wrap items-center space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="btn-outline text-sm py-1 flex items-center"
                  disabled={!notifications.some(n => !n.read)}
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark All Read
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="btn-outline text-sm py-1 flex items-center"
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`glass-card p-4 rounded-xl ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.type === 'match' ? 'bg-green-500/10 text-green-500' :
                          notification.type === 'player' ? 'bg-blue-500/10 text-blue-500' :
                          notification.type === 'tournament' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 ml-3">
                          <div className="flex justify-between">
                            <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
                                  aria-label="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
                                aria-label="Delete notification"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.date).toLocaleString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <a 
                              href={notification.actionUrl} 
                              className="text-xs text-primary hover:underline"
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    {filterType === 'all' 
                      ? "You don't have any notifications at the moment." 
                      : `No ${filterType} notifications found.`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="glass-card p-6 rounded-xl mt-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Notification Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email digests of your notifications
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Match Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Get reminded before matches start
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="messages">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Conversation List */}
            <div className="md:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Messages</h3>
                </div>
                
                <div className="max-h-[65vh] overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedChat === conversation.id ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.avatar}
                            alt={conversation.with}
                            className="w-12 h-12 rounded-full"
                          />
                          {conversation.unread > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{conversation.with}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(conversation.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          {conversation.isGroup && (
                            <p className="text-xs text-primary">
                              {conversation.members} members
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="md:col-span-2">
              {selectedChat ? (
                <div className="glass-card rounded-xl overflow-hidden h-[65vh] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversations.find(c => c.id === selectedChat)?.avatar}
                        alt="Chat avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {conversations.find(c => c.id === selectedChat)?.with}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {conversations.find(c => c.id === selectedChat)?.isGroup
                            ? `${conversations.find(c => c.id === selectedChat)?.members} members`
                            : 'Online'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <button className="p-2 rounded-md hover:bg-muted">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatDetail.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isUser ? 'justify-end' : 'items-start'}`}
                      >
                        {!msg.isUser && (
                          <img
                            src={msg.avatar}
                            alt={msg.sender}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <div>
                          <div
                            className={`rounded-xl p-3 max-w-xs ${
                              msg.isUser
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {!msg.isUser && (
                              <p className="text-xs font-medium mb-1">{msg.sender}</p>
                            )}
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 text-right">
                            {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="form-input flex-1"
                        placeholder="Type a message..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="btn-primary px-4 flex items-center"
                        disabled={!newMessage.trim()}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-xl h-[65vh] flex flex-col items-center justify-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Select a conversation from the sidebar to view messages.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Notifications;
