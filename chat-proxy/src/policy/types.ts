export interface PolicyStyle {
  language: string;
  tone: string;
}

export interface PolicyPayload {
  intent_id: string;
  fixed_facts: string[];
  must_include: string[];
  must_not_say: string[];
  response_outline?: string[];
  style: PolicyStyle;
}

export interface PolicyValidationViolation {
  type: 'missing_must_include' | 'contains_must_not_say' | 'outline_order';
  value: string;
  message: string;
}

export interface PolicyValidationResult {
  ok: boolean;
  violations: PolicyValidationViolation[];
}
