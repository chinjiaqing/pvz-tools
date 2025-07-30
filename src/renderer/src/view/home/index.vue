<template>
 <Button class="min-w-20" label="开启透视" @click="handleTestBtn" />
 <Button class="min-w-20" label="关闭透视" @click="handleTestBtn2" />
</template>

<script lang="ts" setup> 
import { send2main } from '@renderer/ipc/events';
import { onMounted } from 'vue';


function handleTestBtn(){
    send2main('test')
}

function handleTestBtn2(){
    send2main('test2')
}

onMounted(async ()=>{

})
</script>