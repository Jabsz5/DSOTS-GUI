<script setup>
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	player: {
		type: Object,
		required: true,
	},
	characters: {
		type: Array,
		required: true,
	},
})

const emit = defineEmits(['update:player'])

function updatePlayer(key, value) {
	emit('update:player', {
		...props.player,
		[key]: value,
	})
}

function selectedCharacter() {
	return props.characters.find((character) => character.value === props.player.character)
}

function updateCharacter(value) {
	const character = props.characters.find((item) => item.value === value)

	emit('update:player', {
		...props.player,
		character: value,
		color: 1,
	})
}
</script>

<template>
	<section class="player-card">
		<h3>{{ title }}</h3>

		<label class="field">
			<span>Player Name</span>
			<input
				:value="player.name"
				@input="updatePlayer('name', $event.target.value)"
			/>
		</label>

		<div class="field">
			<span>Port</span>

			<div class="port-row">
				<label
					v-for="port in [1, 2, 3, 4]"
					:key="port"
					class="port-pill"
					:class="{ active: player.port === port }"
				>
					<input
						type="radio"
						:name="`${title}-port`"
						:checked="player.port === port"
						@change="updatePlayer('port', port)"
					/>
					P{{ port }}
				</label>
			</div>
		</div>

		<label class="field">
			<span>Character</span>
			<select
				:value="player.character"
				@change="updateCharacter($event.target.value)"
			>
				<option
					v-for="character in characters"
					:key="character.value"
					:value="character.value"
				>
					{{ character.label }}
				</option>
			</select>
		</label>

		<label class="field">
			<span>Color</span>
			<select
				:value="player.color"
				@change="updatePlayer('color', Number($event.target.value))"
			>
				<option
					v-for="colorNumber in selectedCharacter()?.colors || 1"
					:key="colorNumber"
					:value="colorNumber"
				>
					Color {{ colorNumber }}
				</option>
			</select>
		</label>
	</section>
</template>

<style scoped>
.player-card {
	padding: 1rem;
	border: 1px solid var(--border);
	border-radius: 22px;
	background: var(--surface-color);
	box-shadow: var(--shadow);
}

.player-card h3 {
	margin: 0 0 1rem;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	margin-bottom: 0.85rem;
}

.field span {
	color: var(--muted-text);
	font-weight: 800;
}

.field input,
.field select {
	width: 100%;
	border: 1px solid var(--border);
	border-radius: 14px;
	padding: 0.75rem 0.85rem;
	background: var(--surface-color-2);
	color: var(--text-color);
}

.port-row {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.port-pill {
	flex: 1 1 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 44px;
	border-radius: 999px;
	border: 1px solid var(--border);
	background: var(--surface-color-2);
	cursor: pointer;
	font-weight: 900;
}

.port-pill input {
	display: none;
}

.port-pill.active {
	background: var(--primary-color);
	color: #171522;
}
</style>
