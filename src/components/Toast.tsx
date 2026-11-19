import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  subMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  duration?: number;
}

export function Toast({
  message,
  subMessage,
  actionLabel,
  onAction,
  onClose,
  duration,
}: ToastProps) {
  const [timeLeft, setTimeLeft] = useState<number>(
    duration ? Math.ceil(duration / 1000) : 0,
  );
  const [progressPercent, setProgressPercent] = useState<number>(100);

  useEffect(() => {
    if (!duration) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, duration - elapsed);

      setTimeLeft(Math.ceil(remainingMs / 1000));
      setProgressPercent((remainingMs / duration) * 100);

      if (remainingMs <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, message]);

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100, minWidth: "340px" }}
    >
      <div
        className="toast show text-white bg-dark border-0 shadow rounded-3 overflow-hidden"
        role="alert"
      >
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong className="d-block mb-1 fs-6">{message}</strong>
              {subMessage && (
                <small className="text-secondary d-block">{subMessage}</small>
              )}
            </div>

            <div className="d-flex flex-column align-items-center ms-3">
              {actionLabel && onAction && (
                <button
                  type="button"
                  className="btn btn-sm btn-light text-danger fw-bold text-uppercase px-3"
                  onClick={onAction}
                >
                  {actionLabel}
                </button>
              )}
              {duration && timeLeft > 0 && (
                <small className="text-secondary mt-1 fw-semibold">
                  {timeLeft}s
                </small>
              )}
            </div>

            {onClose && !duration && (
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                onClick={onClose}
              />
            )}
          </div>
        </div>

        {duration && (
          <div
            className="progress rounded-0 bg-secondary"
            style={{ height: "4px" }}
          >
            <div
              className="progress-bar bg-danger"
              style={{
                width: `${progressPercent}%`,
                transition: "width 0.05s linear",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
