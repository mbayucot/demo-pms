export type ReceivedProps = {
  status: number;
  data?: {
    file_name: string;
    content: Blob;
  };
};

export type DownloadFileProps = {
  content: Blob;
  file_name: string;
};

export const downloadFile = ({
  content,
  file_name,
}: DownloadFileProps): void => {
  const blob = new Blob([content]);
  const downloadLink = document.createElement("a") as HTMLAnchorElement;
  downloadLink.href = window.URL.createObjectURL(blob);
  downloadLink.download = file_name;
  downloadLink.click();
};
