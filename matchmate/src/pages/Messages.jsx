import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import pic from '../assets/images/pic.jpg';

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const selectedUserId = location.state?.selectedUserId;
  const selectedUserName = location.state?.selectedUserName;

  useEffect(() => {
    if (selectedUserId && selectedUserName) {
      console.log('Selected user ID detected:', selectedUserId, 'Name:', selectedUserName);
      createOrGetConversation(selectedUserId);
    } else {
      // If no user is specified, just fetch all conversations
      fetchConversations();
    }
    const interval = setInterval(fetchConversations, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [selectedUserId, selectedUserName]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      const interval = setInterval(() => fetchMessages(selectedConversation.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('Fetching conversations for current user ID:', userData.id);
      
      const response = await fetch('http://127.0.0.1:8000/api/chat/conversations/', {
        headers: {
          'Authorization': `Token ${userData.token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch conversations:', response.status, errorText);
        throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Conversations fetched:', data);
      
      // Log each conversation's participants
      data.forEach(conversation => {
        console.log(`Conversation ${conversation.id} participants:`, conversation.participants.map(p => `${p.user.first_name} (ID: ${p.user.id})`));
      });
      
      setConversations(data);
      setLoading(false);
    } catch (err) {
      console.error('Error in fetchConversations:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const createOrGetConversation = async (otherUserId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('Creating or getting conversation with user ID:', otherUserId);
      
      if (!userData || !userData.token) {
        throw new Error('User authentication information is missing. Please log in again.');
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/chat/conversations/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${userData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ other_user_id: otherUserId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create conversation:', response.status, errorText);
        throw new Error(`Failed to create conversation: ${response.status} ${response.statusText}`);
      }

      const conversation = await response.json();
      console.log('Conversation created or retrieved:', conversation);
      
      if (!conversation || !conversation.id) {
        throw new Error('Invalid conversation data received from server');
      }
      
      setSelectedConversation(conversation);
      setLoading(false);
      fetchMessages(conversation.id);
      fetchConversations(); // Refresh conversation list
    } catch (err) {
      console.error('Error in createOrGetConversation:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('Fetching messages for conversation ID:', conversationId);
      
      if (!conversationId) {
        console.warn('No conversation ID provided to fetchMessages');
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/chat/conversations/${conversationId}/messages/`, {
        headers: {
          'Authorization': `Token ${userData.token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch messages:', response.status, errorText);
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Messages fetched:', data);
      setMessages(data);
    } catch (err) {
      console.error('Error in fetchMessages:', err);
      setError(err.message);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('Sending message to conversation ID:', selectedConversation.id);
      
      if (!selectedConversation || !selectedConversation.id) {
        throw new Error('No conversation selected. Please select a conversation first.');
      }
      
      // Use the NEW endpoint specifically for sending messages
      const messageEndpoint = `http://127.0.0.1:8000/api/chat/conversations/${selectedConversation.id}/send_message/`;
      console.log('Sending POST request to NEW endpoint:', messageEndpoint);
      console.log('Message content:', newMessage);
      
      const response = await fetch(messageEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${userData.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content: newMessage })
      });

      // Get response text first for debugging
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status} ${responseText}`);
      }

      // Parse the response text as JSON if it's not empty
      let responseData;
      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
          console.log('Parsed response data:', responseData);
        }
      } catch (parseError) {
        console.warn('Could not parse response as JSON:', parseError);
      }

      console.log('Message sent successfully');
      setNewMessage('');
      fetchMessages(selectedConversation.id);
    } catch (err) {
      console.error('Error in sendMessage:', err);
      setError(err.message);
    }
  };

  const getOtherParticipant = (conversation) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      // Get the current user's ID from localStorage
      const currentUserId = userData.id;
      
      // Find the participant that doesn't match the current user's ID
      const otherParticipant = conversation.participants.find(p => p.user.id !== currentUserId);
      
      if (!otherParticipant) {
        console.error('Could not find other participant in conversation:', conversation);
        return { user: { id: 0, first_name: 'Unknown User' } };
      }
      return otherParticipant;
    } catch (err) {
      console.error('Error in getOtherParticipant:', err);
      return { user: { id: 0, first_name: 'Unknown User' } };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-pulse text-white text-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/80 text-white p-4 rounded-lg mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Conversations List */}
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 md:col-span-1 shadow-xl border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Conversations</h2>
            <div className="space-y-2">
              {conversations.length > 0 ? (
                conversations.map(conversation => {
                  const otherParticipant = conversation.other_participant;
                  
                  if (!otherParticipant || !otherParticipant.user) {
                    return null;
                  }
                  
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-secondary text-white shadow-lg'
                          : 'bg-black/30 text-white hover:bg-black/40'
                      }`}
                    >
                      <div className="font-medium">{otherParticipant.user.first_name || 'Unknown User'}</div>
                      {conversation.last_message && (
                        <div className="text-sm opacity-75 truncate">
                          {conversation.last_message.content}
                        </div>
                      )}
                      {conversation.unread_count > 0 && (
                        <div className="bg-secondary text-white text-xs px-2 py-1 rounded-full float-right">
                          {conversation.unread_count}
                        </div>
                      )}
                    </button>
                  );
                }).filter(Boolean)
              ) : (
                <div className="text-white/70 text-center py-4">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Express interest in potential matches to start chatting!</p>
                    </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 md:col-span-3 flex flex-col h-[calc(100vh-200px)] shadow-xl border border-white/10">
            {selectedConversation ? (
              <>
                <div className="border-b border-white/10 pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {selectedConversation.other_participant?.user?.first_name || 'Chat'}
                  </h2>
                  </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-4">
                  {messages.length > 0 ? (
                    messages.map(message => {
                      const userData = JSON.parse(localStorage.getItem('user'));
                      const isCurrentUser = message.sender.user.id === userData.user_id;

                      return (
                        <div
                          key={message.id}
                          className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} mb-4`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                              {message.sender.user.first_name[0]}
                            </div>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isCurrentUser
                                  ? 'bg-secondary text-white rounded-tr-none'
                                  : 'bg-black/30 text-white rounded-tl-none'
                              }`}
                            >
                              <div className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </div>
                            </div>
                          </div>
                          <div className={`text-xs text-white/50 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {new Date(message.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/50">
                      <div className="text-center">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Send a message to start the conversation!</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                  </div>

                <form onSubmit={sendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                    className="flex-1 bg-black/30 text-white placeholder-white/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary border border-white/10"
                      />
                      <button
                        type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded-xl font-medium hover:bg-secondary/80 transition-all duration-300"
                      >
                        Send
                      </button>
                  </form>
                </>
              ) : (
              <div className="flex items-center justify-center h-full text-white/50">
                <div className="text-center">
                  <p>Select a conversation to start chatting</p>
                  {conversations.length === 0 && (
                    <p className="text-sm mt-2">You don't have any conversations yet.<br />Express interest in potential matches to start chatting!</p>
                  )}
                </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 