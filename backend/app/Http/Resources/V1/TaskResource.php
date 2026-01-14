<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
   public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'title' => $this->title,
        'description' => $this->description,
        'priority' => $this->priority,
        'status' => $this->status,
        'deadline' => $this->deadline,
        'estimated_hours' => $this->estimated_hours,
        'category_id' => $this->category_id,
        'task_list_id' => $this->task_list_id,
        'category' => new TaskCategoryResource($this->whenLoaded('category')),
        'task_list' => new TaskListResource($this->whenLoaded('taskList')),
    ];
}

}
