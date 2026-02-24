import { CheckIcon } from "lucide-react";
import { memo, useCallback } from "react";
import type { ModelType } from "@/app/api/chat/model";
import {
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorName,
} from "./ai-elements/model-selector";

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
