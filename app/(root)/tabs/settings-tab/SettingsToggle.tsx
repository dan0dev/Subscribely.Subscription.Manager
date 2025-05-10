import { Switch } from "@/components/ui/switch";

interface SettingsToggleProps {
  title: string;
  description: string;
  checked?: boolean;
  disabled?: boolean;
}

const SettingsToggle = ({ title, description, checked = false, disabled = false }: SettingsToggleProps) => {
  return (
    <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <div>
        <p className="text-light-300 text-base mb-1">{title}</p>
        <p className="text-light-400 text-sm">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={checked} disabled={disabled} className="shrink-0 cursor-not-allowed" />
      </div>
    </div>
  );
};

export default SettingsToggle;
