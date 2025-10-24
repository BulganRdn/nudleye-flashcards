"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  Upload,
  Download,
  Sparkles,
  BookOpen,
  AlertCircle,
  Check,
  X,
  Copy,
  FileText,
} from "lucide-react";

type WordPair = {
  id: string;
  korean: string;
  mongolian: string;
};

type DeckFormData = {
  name: string;
  description: string;
  emoji: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  isPublic: boolean;
};

const EMOJI_OPTIONS = [
  "💬", "📚", "💼", "🎬", "🎵", "✈️", "🍜", "🏠", "👔", "🎓",
  "💪", "🎨", "🎮", "🏥", "🚗", "💰", "🌸", "⚽", "🎭", "📱",
  "☕", "🍕", "🎉", "❤️", "🌟", "🔥", "👨‍👩‍👧‍👦", "🏢", "🌍", "📝"
];

const CATEGORIES = [
  "Ерөнхий", "Ажил", "Аялал", "Хоол", "Спорт", "Урлаг", 
  "Технологи", "Эрүүл мэнд", "Сургууль", "Гэр ахуй"
];

export default function CreateDeckPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState<DeckFormData>({
    name: "",
    description: "",
    emoji: "📚",
    category: "Ерөнхий",
    difficulty: "beginner",
    isPublic: false,
  });

  const [words, setWords] = useState<WordPair[]>([]);
  const [currentWord, setCurrentWord] = useState({ korean: "", mongolian: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Add or update word
  const handleAddWord = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentWord.korean.trim()) {
      newErrors.korean = "Солонгос үг оруулна уу";
    }
    if (!currentWord.mongolian.trim()) {
      newErrors.mongolian = "Монгол орчуулга оруулна уу";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingId) {
      // Update existing word
      setWords(words.map(w => 
        w.id === editingId 
          ? { ...w, korean: currentWord.korean.trim(), mongolian: currentWord.mongolian.trim() }
          : w
      ));
      setEditingId(null);
    } else {
      // Add new word
      const newWord: WordPair = {
        id: Date.now().toString(),
        korean: currentWord.korean.trim(),
        mongolian: currentWord.mongolian.trim(),
      };
      setWords([...words, newWord]);
    }

    setCurrentWord({ korean: "", mongolian: "" });
    setErrors({});
  };

  // Edit word
  const handleEditWord = (word: WordPair) => {
    setCurrentWord({ korean: word.korean, mongolian: word.mongolian });
    setEditingId(word.id);
    setErrors({});
  };

  // Delete word
  const handleDeleteWord = (id: string) => {
    setWords(words.filter(w => w.id !== id));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setCurrentWord({ korean: "", mongolian: "" });
    setEditingId(null);
    setErrors({});
  };

  // Import words from text
  const handleImport = () => {
    const lines = importText.split("\n").filter(line => line.trim());
    const importedWords: WordPair[] = [];

    lines.forEach(line => {
      const parts = line.split(/[,\t|]/); // Split by comma, tab, or pipe
      if (parts.length >= 2) {
        importedWords.push({
          id: Date.now().toString() + Math.random(),
          korean: parts[0].trim(),
          mongolian: parts[1].trim(),
        });
      }
    });

    setWords([...words, ...importedWords]);
    setImportText("");
    setShowImportModal(false);
  };

  // Export words to text
  const handleExport = () => {
    const text = words.map(w => `${w.korean}\t${w.mongolian}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.name || "deck"}_words.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Цомгийн нэр оруулна уу";
    }
    if (words.length === 0) {
      newErrors.words = "Наад зах нь 1 үг нэмнэ үү";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save deck
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/decks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          words: words,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Цомог амжилттай үүслээ! ✅");
        router.push(`/deck/${data.id}`);
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error saving deck:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1CB0F6]"></div>
          <div className="skeleton h-4 w-32 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#8549BA]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#1CB0F6]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="button-press group inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 mb-6"
          >
            <span className="p-2 rounded-xl glass-card-dark group-hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="w-5 h-5" />
            </span>
            <span className="text-sm font-semibold">Буцах</span>
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1CB0F6] to-[#8549BA] flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Шинэ цомог үүсгэх</h1>
              <p className="text-white/60 text-sm md:text-base">
                Өөрийн үг, орчуулгаа нэмээд цомог үүсгээрэй
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Deck Info Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative glass-card-dark rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1CB0F6]" />
                  Үндсэн мэдээлэл
                </h2>

                {/* Emoji Picker */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Emoji</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="button-press w-full p-4 rounded-xl glass-card-dark border border-white/10 hover:border-[#1CB0F6] transition-all flex items-center justify-between"
                    >
                      <span className="text-4xl">{formData.emoji}</span>
                      <span className="text-sm text-white/60">Сонгох</span>
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 right-0 mt-2 p-4 glass-card-dark rounded-xl border border-white/10 z-10 grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                        {EMOJI_OPTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setFormData({ ...formData, emoji });
                              setShowEmojiPicker(false);
                            }}
                            className="button-press p-3 rounded-lg hover:bg-white/10 transition-all text-2xl"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Цомгийн нэр <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Жишээ: Daily Conversations"
                    className="w-full px-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:outline-none transition-all"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Тайлбар</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Энэ цомгийн тухай товч тайлбар..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Ангилал</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:outline-none transition-all cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Түвшин</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "beginner", label: "Анхан", color: "from-[#58CC02] to-[#3A8500]" },
                      { value: "intermediate", label: "Дунд", color: "from-[#FFC715] to-[#FF9600]" },
                      { value: "advanced", label: "Дэвшилтэт", color: "from-[#E53838] to-[#FF4444]" },
                    ].map((diff) => (
                      <button
                        key={diff.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty: diff.value as any })}
                        className={`button-press px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          formData.difficulty === diff.value
                            ? `bg-gradient-to-r ${diff.color} text-white shadow-lg`
                            : "glass-card-dark text-white/60 hover:text-white"
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Public Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl glass-card-dark border border-white/10">
                  <div>
                    <p className="font-medium">Олон нийтэд нээлттэй</p>
                    <p className="text-xs text-white/60">Бусад хэрэглэгчид татаж авах боломжтой</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                    className={`button-press relative w-12 h-6 rounded-full transition-all ${
                      formData.isPublic ? "bg-[#58CC02]" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.isPublic ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#58CC02] to-[#3A8500] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative glass-card-dark rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-4">Статистик</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <div className="text-3xl font-bold text-[#1CB0F6]">{words.length}</div>
                    <div className="text-xs text-white/60 mt-1">Нийт үг</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <div className="text-3xl font-bold text-[#58CC02]">0%</div>
                    <div className="text-xs text-white/60 mt-1">Эзэмшсэн</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Words Management */}
          <div className="space-y-6">
            {/* Add Word Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8549BA] to-[#6435A0] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative glass-card-dark rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#8549BA]" />
                    {editingId ? "Үг засах" : "Үг нэмэх"}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="button-press p-2 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
                      title="Импорт"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    {words.length > 0 && (
                      <button
                        onClick={handleExport}
                        className="button-press p-2 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
                        title="Экспорт"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Korean Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Солонгос үг <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentWord.korean}
                      onChange={(e) => setCurrentWord({ ...currentWord, korean: e.target.value })}
                      placeholder="안녕하세요"
                      className="w-full px-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:outline-none transition-all"
                      onKeyPress={(e) => e.key === "Enter" && handleAddWord()}
                    />
                    {errors.korean && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.korean}
                      </p>
                    )}
                  </div>

                  {/* Mongolian Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Монгол орчуулга <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentWord.mongolian}
                      onChange={(e) => setCurrentWord({ ...currentWord, mongolian: e.target.value })}
                      placeholder="Сайн байна уу"
                      className="w-full px-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:outline-none transition-all"
                      onKeyPress={(e) => e.key === "Enter" && handleAddWord()}
                    />
                    {errors.mongolian && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.mongolian}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddWord}
                      className="button-press flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {editingId ? (
                        <>
                          <Check className="w-4 h-4" />
                          Засвар хадгалах
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Нэмэх
                        </>
                      )}
                    </button>
                    {editingId && (
                      <button
                        onClick={handleCancelEdit}
                        className="button-press px-4 py-3 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {errors.words && (
                  <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.words}
                  </div>
                )}
              </div>
            </div>

            {/* Word List */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#58CC02] to-[#3A8500] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative glass-card-dark rounded-3xl p-6">
                <h3 className="text-lg font-bold mb-4">
                  Үгийн жагсаалт ({words.length})
                </h3>

                {words.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-card-dark mb-3">
                      <FileText className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-white/60 text-sm">
                      Үг хараахан нэмээгүй байна
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {words.map((word, index) => (
                      <div
                        key={word.id}
                        className={`p-4 rounded-xl transition-all ${
                          editingId === word.id
                            ? "bg-[#1CB0F6]/20 border border-[#1CB0F6]/30"
                            : "glass-card-dark hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{word.korean}</div>
                            <div className="text-sm text-white/60 truncate">{word.mongolian}</div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleEditWord(word)}
                              className="button-press p-2 rounded-lg glass-card-dark hover:bg-white/10 transition-all"
                              title="Засах"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWord(word.id)}
                              className="button-press p-2 rounded-lg glass-card-dark hover:bg-red-500/20 text-red-400 transition-all"
                              title="Устгах"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowPreview(true)}
            disabled={words.length === 0}
            className="button-press flex-1 py-4 rounded-xl glass-card-dark hover:bg-white/10 text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="w-5 h-5" />
            Урьдчилан харах
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || words.length === 0}
            className="button-press flex-1 py-4 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold hover:shadow-lg hover:shadow-[#58CC02]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Хадгалж байна...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Хадгалах
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-3xl blur-xl opacity-50" />
            <div className="relative glass-card-dark rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Үг импортлох</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="button-press p-2 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-white/60 mb-4">
                Үг бүрийг шинэ мөрөнд бичнэ. Солонгос үг ба монгол орчуулгыг таслал, таб эсвэл | тэмдгээр тусгаарлана.
                <br />
                Жишээ: <code className="text-[#1CB0F6]">안녕하세요, Сайн байна уу</code>
              </p>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="안녕하세요, Сайн байна уу&#10;감사합니다, Баярлалаа&#10;죄송합니다, Уучлаарай"
                rows={10}
                className="w-full px-4 py-3 rounded-xl glass-card-dark border border-white/10 focus:border-[#1CB0F6] focus:outline-none transition-all resize-none mb-4 font-mono text-sm"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="button-press flex-1 py-3 rounded-xl glass-card-dark hover:bg-white/10 text-white font-semibold transition-all"
                >
                  Болих
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="button-press flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Импортлох
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1CB0F6] to-[#8549BA] rounded-3xl blur-xl opacity-50" />
            <div className="relative glass-card-dark rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Урьдчилан харах</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="button-press p-2 rounded-xl glass-card-dark hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Deck Info */}
              <div className="bg-gradient-to-br from-[#1CB0F6]/20 via-[#8549BA]/20 to-[#58CC02]/20 p-6 rounded-2xl mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl">{formData.emoji}</div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-2">{formData.name || "Цомгийн нэр"}</h4>
                    <p className="text-white/70">{formData.description || "Тайлбар байхгүй"}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-lg glass-card-dark text-sm">
                    {formData.category}
                  </span>
                  <span className="px-3 py-1 rounded-lg glass-card-dark text-sm capitalize">
                    {formData.difficulty === "beginner" && "Анхан"}
                    {formData.difficulty === "intermediate" && "Дунд"}
                    {formData.difficulty === "advanced" && "Дэвшилтэт"}
                  </span>
                  {formData.isPublic && (
                    <span className="px-3 py-1 rounded-lg bg-[#58CC02]/20 text-[#58CC02] text-sm">
                      Олон нийтэд нээлттэй
                    </span>
                  )}
                </div>
              </div>

              {/* Preview Words */}
              <div>
                <h4 className="font-bold mb-3">Үгийн жагсаалт ({words.length})</h4>
                <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {words.map((word, index) => (
                    <div
                      key={word.id}
                      className="p-4 rounded-xl glass-card-dark border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">{word.korean}</div>
                          <div className="text-sm text-white/60">{word.mongolian}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="button-press flex-1 py-3 rounded-xl glass-card-dark hover:bg-white/10 text-white font-semibold transition-all"
                >
                  Хаах
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleSave();
                  }}
                  className="button-press flex-1 py-3 rounded-xl bg-gradient-to-r from-[#58CC02] to-[#3A8500] text-white font-semibold hover:shadow-lg transition-all"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}