import { Moon, Sun, MapPin, Phone, Mail, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export default function AccountPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-screen pb-16">
      <div className="sticky top-0 z-30 bg-background border-b px-4 py-3">
        <h1 className="text-h1 font-semibold">Account</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Theme Toggle */}
          <Card className="p-4">
            <h2 className="text-body-lg font-semibold mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-body">Theme</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  data-testid="button-theme-light"
                  className="gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Light
                </Button>
                <Button
                  size="sm"
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  data-testid="button-theme-dark"
                  className="gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </Button>
              </div>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-4 space-y-4">
            <h2 className="text-body-lg font-semibold">About Handshop</h2>
            
            <div className="space-y-3 text-body text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Location-First Shopping</p>
                  <p className="text-small">
                    Find nearby shops and get accurate delivery prices based on your exact location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Real-Time Updates</p>
                  <p className="text-small">
                    Track your orders in real-time from preparation to delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Transparent Pricing</p>
                  <p className="text-small">
                    See exact delivery costs upfront - flat rate or distance-based pricing.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Version Info */}
          <Card className="p-4">
            <div className="flex items-center gap-2 text-small text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Version 1.0.0</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
