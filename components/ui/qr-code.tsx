import QRCode from "qrcode";

type QrCodeProps = {
  value: string;
  size?: number;
  className?: string;
};

export async function QrCode({ value, size = 160, className = "" }: QrCodeProps) {
  const dataUrl = await QRCode.toDataURL(value, {
    width: size,
    margin: 2,
    color: { dark: "#1e293b", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt={`QR Code: ${value}`}
      width={size}
      height={size}
      className={className}
    />
  );
}
