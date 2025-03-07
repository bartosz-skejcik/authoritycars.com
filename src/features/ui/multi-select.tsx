import MultipleSelector, { Option } from "@/components/ui/multiselect";

type Props = {
  values: Option[];
  value?: Option[];
  placeholder: string;
  hideClearAllButton?: boolean;
  hidePlaceholderWhenSelected?: boolean;
  onChange?: (value: Option[] | undefined) => void;
};

export default function MultiSelect({
  values,
  value,
  placeholder,
  hideClearAllButton = true,
  hidePlaceholderWhenSelected = true,
  onChange,
}: Props) {
  return (
    <div className="*:not-first:mt-2">
      <MultipleSelector
        value={value}
        options={values}
        placeholder={placeholder}
        hideClearAllButton={hideClearAllButton}
        hidePlaceholderWhenSelected={hidePlaceholderWhenSelected}
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
        onChange={onChange}
      />
    </div>
  );
}
