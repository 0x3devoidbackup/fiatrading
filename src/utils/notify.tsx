// notification.ts

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationOptions {
  message: string;
  type?: NotificationType;
  duration?: number;
}

class NotificationManager {
  private container: HTMLDivElement | null = null;
  private notifications: Set<HTMLDivElement> = new Set();

  private initContainer() {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.id = "notification-container";
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  private getNotificationStyles(type: NotificationType): string {
    const styles = {
      success: {
        bg: "#10b981",
        icon: "✓",
      },
      error: {
        bg: "#ef4444",
        icon: "✕",
      },
      info: {
        bg: "#3b82f6",
        icon: "ℹ",
      },
      warning: {
        bg: "#f59e0b",
        icon: "⚠",
      },
    };

    return styles[type].bg;
  }

  private getIcon(type: NotificationType): string {
    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠",
    };

    return icons[type];
  }

  show({ message, type = "info", duration = 5000 }: NotificationOptions) {
    this.initContainer();

    const notification = document.createElement("div");
    notification.style.cssText = `
      background: ${this.getNotificationStyles(type)};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 320px;
      max-width: 420px;
      pointer-events: auto;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(450px);
      opacity: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
    `;

    const icon = document.createElement("span");
    icon.style.cssText = `
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      flex-shrink: 0;
    `;
    icon.textContent = this.getIcon(type);

    const messageEl = document.createElement("span");
    messageEl.style.cssText = `
      flex: 1;
      font-weight: 500;
    `;
    messageEl.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      flex-shrink: 0;
      transition: background 0.2s;
    `;
    closeBtn.innerHTML = "×";
    closeBtn.onmouseover = () => {
      closeBtn.style.background = "rgba(255, 255, 255, 0.3)";
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.background = "rgba(255, 255, 255, 0.2)";
    };

    notification.appendChild(icon);
    notification.appendChild(messageEl);
    notification.appendChild(closeBtn);

    this.container?.appendChild(notification);
    this.notifications.add(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    });

    // Hover effects
    notification.onmouseenter = () => {
      notification.style.transform = "translateX(-8px) scale(1.02)";
      notification.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.3)";
    };
    notification.onmouseleave = () => {
      notification.style.transform = "translateX(0) scale(1)";
      notification.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2)";
    };

    const remove = () => {
      notification.style.transform = "translateX(450px)";
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.remove();
        this.notifications.delete(notification);
        if (this.notifications.size === 0 && this.container) {
          this.container.remove();
          this.container = null;
        }
      }, 300);
    };

    closeBtn.onclick = (e) => {
      e.stopPropagation();
      remove();
    };

    notification.onclick = remove;

    if (duration > 0) {
      setTimeout(remove, duration);
    }
  }
}

const notificationManager = new NotificationManager();

export const notify = (message: string, type: NotificationType = "info") => {
  notificationManager.show({ message, type });
};

export const notifySuccess = (message: string) => {
  notificationManager.show({ message, type: "success" });
};

export const notifyError = (message: string) => {
  notificationManager.show({ message, type: "error" });
};

export const notifyWarning = (message: string) => {
  notificationManager.show({ message, type: "warning" });
};

export const notifyInfo = (message: string) => {
  notificationManager.show({ message, type: "info" });
};