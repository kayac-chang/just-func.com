import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { createHost, createSlot } from "create-slots";
import type { ComponentProps } from "react";

const Question = createSlot("div");
const AnswerHeading = createSlot(CollapsibleTrigger);
const Answer = createSlot(CollapsibleContent);

export function Exam(props: ComponentProps<"div">) {
  return createHost(props.children, (slots) => {
    const question_props = slots.getProps(Question);
    const answer_content_props = slots.getProps(Answer);
    const answer_heading_props = slots.getProps(AnswerHeading);
    return (
      <div {...props}>
        <div {...question_props} />
        <Collapsible>
          {answer_heading_props ? (
            <CollapsibleTrigger {...answer_heading_props}></CollapsibleTrigger>
          ) : (
            <CollapsibleTrigger className="flex items-center gap-2">
              點我看答案
              <ChevronDown />
            </CollapsibleTrigger>
          )}

          <CollapsibleContent {...answer_content_props}></CollapsibleContent>
        </Collapsible>
      </div>
    );
  });
}
export default Exam;
Exam.Question = Question;
Exam.AnswerHeading = AnswerHeading;
Exam.Answer = Answer;
