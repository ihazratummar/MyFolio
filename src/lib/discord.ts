const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1442057843284115497/GgXitJ6JVywxC4EIIS3758iOtEpmia8j0wmL9jxv_CX4i8uiVkmm8sPG_foqbNs9p0zK";

interface WebhookPayload {
    email: string;
    name?: string;
    picture?: string;
    success: boolean;
    ip?: string;
}

export async function sendDiscordWebhook({ email, name, picture, success, ip }: WebhookPayload) {
    if (!DISCORD_WEBHOOK_URL) return;

    const color = success ? 0x00ff00 : 0xff0000; // Green for success, Red for failure
    const title = success ? "✅ Admin Login Successful" : "⛔ Unauthorized Login Attempt";

    const embed = {
        title: title,
        color: color,
        timestamp: new Date().toISOString(),
        thumbnail: picture ? { url: picture } : undefined,
        fields: [
            {
                name: "User",
                value: `${name || 'Unknown'} (${email})`,
                inline: true
            },
            {
                name: "Status",
                value: success ? "Granted" : "Denied",
                inline: true
            },
            {
                name: "IP Address",
                value: ip || "Unknown",
                inline: false
            }
        ],
        footer: {
            text: "MyFolio Admin Security"
        }
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                embeds: [embed],
            }),
        });
    } catch (error) {
        console.error("Failed to send Discord webhook:", error);
    }
}
