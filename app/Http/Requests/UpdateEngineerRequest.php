<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @method mixed route(string $param = null, mixed $default = null)
 */
class UpdateEngineerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var \App\Models\Engineer|null $engineer */
        $engineer = $this->route('engineer');
        $engineerId = $engineer?->id;

        return [
            'employee_code' => ['nullable', 'string', 'max:50', 'unique:engineers,employee_code,'.$engineerId],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:engineers,email,'.$engineerId],
            'phone' => ['nullable', 'string', 'max:50'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:60'],
            'primary_province_id' => ['nullable', 'exists:provinces,id'],
            'hired_at' => ['nullable', 'date'],
            'is_active' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Get the validated data from the request.
     *
     * @return array<string, mixed>
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated($key, $default);

        // Convert is_active to boolean if present
        if (array_key_exists('is_active', $validated)) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        } else {
            $validated['is_active'] = true;
        }

        return $validated;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_code.unique' => 'This employee code is already in use.',
            'name.required' => 'Engineer name is required.',
            'email.unique' => 'This email address is already in use.',
            'email.email' => 'Please provide a valid email address.',
            'experience_years.min' => 'Experience years cannot be negative.',
            'experience_years.max' => 'Experience years seems unrealistic.',
            'primary_province_id.exists' => 'The selected province is invalid.',
        ];
    }
}
