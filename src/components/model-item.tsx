import { memo, useCallback } from "react";
import {
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorName,
} from "./ai-elements/model-selector";
import { CheckIcon } from "lucide-react";
import { ModelType } from "@/app/api/chat/model";

const ModelItem = ({
  model,
  selectedModel,
  onSelect,
}: {
  model: ModelType;
  selectedModel: ModelType;
  onSelect: (model: ModelType) => void;
}) => {
  const handleSelect = useCallback(() => onSelect(model), [onSelect, model]);
  return (
    <ModelSelectorItem key={model.id} onSelect={handleSelect} value={model.id}>
      <ModelSelectorLogo provider={model.chefSlug} />
      <ModelSelectorName>{model.name}</ModelSelectorName>
      {selectedModel.id === model.id ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  );
};

export default memo(ModelItem);
