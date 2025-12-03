<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $userId = $this->user? ->id;

        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $userId,
            'password' => $userId ? 'nullable|min:8' : 'required|min:8',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ];
    }
}