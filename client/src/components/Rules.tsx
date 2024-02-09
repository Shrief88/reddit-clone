const RULES = [
  "Remember the human",
  "Behave like you would in real life",
  "Look for the original source of content",
  "Search for duplicates before posting",
  "Read the community’s rules",
];
const Rules = () => {
  return (
    <div className="hidden md:block h-fit rounded-lg border border-border shadow-md md:col-span-1 md:order-last">
      <div className="flex flex-col p-6 bg-card font-medium">
        <p className="py-3 font-semibold text-lg">Posting to Beddit</p>
        <ol className="divide-y-2 divide-gray-200">
          {RULES.map((rule, index) => (
            <li key={index} className="py-1">
              {rule}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Rules;
