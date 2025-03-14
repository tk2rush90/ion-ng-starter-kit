export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string); // Base64 데이터 반환
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file); // 파일을 Base64로 읽기
  });
};
