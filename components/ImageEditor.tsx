
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setImage(readerEvent.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const editImage = async () => {
    if (!image || !prompt) return;

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setEditedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error editing image:', error);
      alert('編輯圖片時發生錯誤。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">AI 圖片編輯</h2>
        <p className="text-slate-600">使用 Gemini 2.5 Flash Image 快速修圖（例如：移除背景、添加濾鏡）。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">1. 上傳原始圖片</h3>
            <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all h-64 flex flex-col items-center justify-center ${image ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
              {image ? (
                <img src={image} alt="Original" className="max-h-full max-w-full rounded-lg shadow-sm object-contain" />
              ) : (
                <div className="text-center text-slate-400">
                  <i className="fas fa-image text-4xl mb-2"></i>
                  <p className="text-sm">點擊或拖放圖片至此</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">2. 描述您要的修改</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：'移除背景'、'加入復古濾鏡'、'將圖片轉為黑白'"
              className="w-full h-24 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
            />
            <button
              onClick={editImage}
              disabled={!image || !prompt || isProcessing}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> 處理中...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i> 開始編輯
                </>
              )}
            </button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-semibold text-slate-700 mb-4">編輯結果</h3>
          <div className="flex-1 border-2 border-slate-50 bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden min-h-[300px]">
            {editedImage ? (
              <>
                <img src={editedImage} alt="Edited" className="max-h-full max-w-full object-contain animate-fade-in" />
                <a
                  href={editedImage}
                  download="edited-image.png"
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-indigo-600 hover:scale-110 transition-transform"
                >
                  <i className="fas fa-download"></i>
                </a>
              </>
            ) : isProcessing ? (
              <div className="flex flex-col items-center gap-4 text-indigo-400">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium">AI 正在努力生成中...</p>
              </div>
            ) : (
              <div className="text-center text-slate-300">
                <i className="fas fa-wand-sparkles text-6xl mb-4 opacity-20"></i>
                <p>完成編輯後，結果將顯示於此</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ImageEditor;
