<script setup lang="ts">
import { ref, watch } from 'vue'

import type { Transaction, TransactionType } from '@/types/transaction'

const props = withDefaults(
  defineProps<{
    transaction?: Transaction | null
  }>(),
  {
    transaction: null,
  },
)

const emit = defineEmits<{
  submit: [transaction: Transaction]
  update: [transaction: Transaction]
}>()

const type = ref<TransactionType>('expense')
const amount = ref<number | ''>('')
const category = ref('')
const date = ref('')
const note = ref('')

watch(
  () => props.transaction,
  (transaction) => {
    if (transaction) {
      type.value = transaction.type
      amount.value = transaction.amount
      category.value = transaction.category
      date.value = transaction.date
      note.value = transaction.note ?? ''
    } else {
      type.value = 'expense'
      amount.value = ''
      category.value = ''
      date.value = ''
      note.value = ''
    }
  },
  { immediate: true },
)

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'

function handleSubmit() {
  const amountNumber = Number(amount.value)
  const trimmedCategory = category.value.trim()
  const trimmedDate = date.value.trim()

  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    return
  }
  if (trimmedCategory === '' || trimmedDate === '') {
    return
  }

  const trimmedNote = note.value.trim()

  if (props.transaction) {
    emit('update', {
      ...props.transaction,
      type: type.value,
      amount: amountNumber,
      category: trimmedCategory,
      date: trimmedDate,
      note: trimmedNote === '' ? null : trimmedNote,
    })
    return
  }

  emit('submit', {
    id: Date.now(),
    type: type.value,
    amount: amountNumber,
    category: trimmedCategory,
    date: trimmedDate,
    note: trimmedNote === '' ? null : trimmedNote,
  })
}
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold text-slate-900">
      {{ transaction ? 'Edit Transaction' : 'Add Transaction' }}
    </h2>

    <form
      class="mt-4 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      @submit.prevent="handleSubmit"
    >
      <fieldset>
        <legend class="text-sm font-medium text-slate-700">Type</legend>
        <div class="mt-2 flex gap-4">
          <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input v-model="type" type="radio" value="income" class="h-4 w-4 accent-indigo-600" />
            Income
          </label>
          <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input v-model="type" type="radio" value="expense" class="h-4 w-4 accent-indigo-600" />
            Expense
          </label>
        </div>
      </fieldset>

      <div>
        <label for="amount" class="block text-sm font-medium text-slate-700">Amount</label>
        <input
          id="amount"
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          required
          :class="fieldClass"
        />
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-slate-700">Category</label>
        <input
          id="category"
          v-model="category"
          type="text"
          placeholder="e.g. Groceries"
          required
          :class="fieldClass"
        />
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-slate-700">Date</label>
        <input id="date" v-model="date" type="date" required :class="fieldClass" />
      </div>

      <div>
        <label for="note" class="block text-sm font-medium text-slate-700">Note</label>
        <textarea
          id="note"
          v-model="note"
          rows="3"
          placeholder="Optional"
          :class="fieldClass"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {{ transaction ? 'Save Changes' : 'Add Transaction' }}
      </button>
    </form>
  </section>
</template>
