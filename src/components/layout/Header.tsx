import { Link } from "react-router-dom";
import {
  HelpCircle,
  Menu,
  Moon,
  Sun,
  MapPin,
  LogOut,
  Settings,
  User,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme-provider";
import { project } from "@/mock/project";
import { CommandSearch } from "./CommandSearch";
import { NotificationsMenu } from "./NotificationsMenu";
import { Badge } from "@/components/ui/badge";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Project context (center-left) */}
      <div className="hidden min-w-0 items-center gap-3 md:flex">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-display text-sm font-semibold">{project.name}</h2>
            <Badge variant="neutral" className="hidden shrink-0 lg:inline-flex">
              {project.capacity}
            </Badge>
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {project.location}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <CommandSearch />

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle {theme === "dark" ? "light" : "dark"} mode</TooltipContent>
          </Tooltip>

          <NotificationsMenu />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Help">
                <HelpCircle className="h-[18px] w-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help & documentation</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight lg:block">
                <p className="text-sm font-semibold">Rahul Sharma</p>
                <p className="text-[11px] text-muted-foreground">Project Director</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="normal-case">
              <div className="flex items-center gap-3 py-1">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">Rahul Sharma</p>
                  <p className="text-xs text-muted-foreground">rahul.sharma@infragrit.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CircleUserRound className="h-4 w-4" /> Preferences
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
