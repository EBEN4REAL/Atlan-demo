<template>
    <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        style="width: 256px"
        mode="vertical"
        @click="handleClick"
    >
        <a-menu-item key="1">
            <template #icon>
                <!-- <MailOutlined /> -->
            </template>
            Navigation One
        </a-menu-item>
        <a-menu-item key="2">
            <template #icon>
                <!-- <CalendarOutlined /> -->
            </template>
            Navigation Two
        </a-menu-item>
        <a-sub-menu key="sub1">
            <template #icon>
                <!-- <AppstoreOutlined /> -->
            </template>
            <template #title>Navigation Three</template>
            <a-menu-item key="3">Option 3</a-menu-item>
            <a-menu-item key="4">Option 4</a-menu-item>
            <a-sub-menu key="sub1-2" title="Submenu">
                <a-menu-item key="5">Option 5</a-menu-item>
                <a-menu-item key="6">Option 6</a-menu-item>
            </a-sub-menu>
        </a-sub-menu>
        <a-sub-menu key="sub2">
            <template #icon>
                <!-- <SettingOutlined /> -->
            </template>
            <template #title>Navigation Four</template>
            <a-menu-item key="7">Option 7</a-menu-item>
            <a-menu-item key="8">Option 8</a-menu-item>
            <a-menu-item key="9">Option 9</a-menu-item>
            <a-menu-item key="10">Option 10</a-menu-item>
            <a-menu-item key="11">Option 11</a-menu-item>
            <a-menu-item key="12">Option 12</a-menu-item>
            <a-menu-item key="13">Option 13</a-menu-item>
            <a-menu-item key="14">Option 14</a-menu-item>
            <a-menu-item key="15">Option 15</a-menu-item>
            <a-menu-item key="16">Option 16</a-menu-item>
            <a-menu-item key="17">Option 17</a-menu-item>
            <a-menu-item key="18">Option 18</a-menu-item>
            <a-menu-item key="19">Option 19</a-menu-item>
            <a-menu-item key="20">Option 20</a-menu-item>
            <a-menu-item key="21">Option 21</a-menu-item>
            <a-menu-item key="22">Option 22</a-menu-item>
            <a-menu-item key="23">Option 23</a-menu-item>
            <a-menu-item key="24">Option 24</a-menu-item>
            <a-menu-item key="25">Option 25</a-menu-item>
            <a-menu-item key="26">Option 26</a-menu-item>
            <a-menu-item key="27">Option 27</a-menu-item>
            <a-menu-item key="28">Option 28</a-menu-item>
            <a-menu-item key="29">Option 29</a-menu-item>
            <a-menu-item key="30">Option 30</a-menu-item>
            <a-menu-item key="31">Option 31</a-menu-item>
            <a-menu-item key="32">Option 32</a-menu-item>
            <a-menu-item key="33">Option 33</a-menu-item>
            <a-menu-item key="34">Option 34</a-menu-item>
            <a-menu-item key="35">Option 35</a-menu-item>
            <a-menu-item key="36">Option 36</a-menu-item>
            <a-menu-item key="37">Option 37</a-menu-item>
            <a-menu-item key="38">Option 38</a-menu-item>
            <a-menu-item key="39">Option 39</a-menu-item>
            <a-menu-item key="40">Option 40</a-menu-item>
            <a-menu-item key="41">Option 41</a-menu-item>
            <a-menu-item key="42">Option 42</a-menu-item>
            <a-menu-item key="43">Option 43</a-menu-item>
            <a-menu-item key="44">Option 44</a-menu-item>
            <a-menu-item key="45">Option 45</a-menu-item>
            <a-menu-item key="46">Option 46</a-menu-item>
            <a-menu-item key="47">Option 47</a-menu-item>
            <a-menu-item key="48">Option 48</a-menu-item>
            <a-menu-item key="49">Option 49</a-menu-item>
            <a-menu-item key="50">Option 50</a-menu-item>
            <a-menu-item key="51">Option 51</a-menu-item>
            <a-menu-item key="52">Option 52</a-menu-item>
            <a-menu-item key="53">Option 53</a-menu-item>
            <a-menu-item key="54">Option 54</a-menu-item>
            <a-menu-item key="55">Option 55</a-menu-item>
            <a-menu-item key="56">Option 56</a-menu-item>
            <a-menu-item key="57">Option 57</a-menu-item>
            <a-menu-item key="58">Option 58</a-menu-item>
            <a-menu-item key="59">Option 59</a-menu-item>
            <a-menu-item key="60">Option 60</a-menu-item>
            <a-menu-item key="61">Option 61</a-menu-item>
            <a-menu-item key="62">Option 62</a-menu-item>
            <a-menu-item key="63">Option 63</a-menu-item>
            <a-menu-item key="64">Option 64</a-menu-item>
            <a-menu-item key="65">Option 65</a-menu-item>
            <a-menu-item key="66">Option 66</a-menu-item>
            <a-menu-item key="67">Option 67</a-menu-item>
            <a-menu-item key="68">Option 68</a-menu-item>
            <a-menu-item key="69">Option 69</a-menu-item>
            <a-menu-item key="70">Option 70</a-menu-item>
            <a-menu-item key="71">Option 71</a-menu-item>
            <a-menu-item key="72">Option 72</a-menu-item>
            <a-menu-item key="73">Option 73</a-menu-item>
            <a-menu-item key="74">Option 74</a-menu-item>
            <a-menu-item key="75">Option 75</a-menu-item>
            <a-menu-item key="76">Option 76</a-menu-item>
            <a-menu-item key="77">Option 77</a-menu-item>
            <a-menu-item key="78">Option 78</a-menu-item>
            <a-menu-item key="79">Option 79</a-menu-item>
            <a-menu-item key="80">Option 80</a-menu-item>
            <a-menu-item key="81">Option 81</a-menu-item>
            <a-menu-item key="82">Option 82</a-menu-item>
            <a-menu-item key="83">Option 83</a-menu-item>
            <a-menu-item key="84">Option 84</a-menu-item>
            <a-menu-item key="85">Option 85</a-menu-item>
            <a-menu-item key="86">Option 86</a-menu-item>
            <a-menu-item key="87">Option 87</a-menu-item>
            <a-menu-item key="88">Option 88</a-menu-item>
            <a-menu-item key="89">Option 89</a-menu-item>
            <a-menu-item key="90">Option 90</a-menu-item>
            <a-menu-item key="91">Option 91</a-menu-item>
            <a-menu-item key="92">Option 92</a-menu-item>
            <a-menu-item key="93">Option 93</a-menu-item>
            <a-menu-item key="94">Option 94</a-menu-item>
            <a-menu-item key="95">Option 95</a-menu-item>
            <a-menu-item key="96">Option 96</a-menu-item>
            <a-menu-item key="97">Option 97</a-menu-item>
            <a-menu-item key="98">Option 98</a-menu-item>
            <a-menu-item key="99">Option 99</a-menu-item>
            <a-menu-item key="100">Option 100</a-menu-item>
            <a-menu-item key="101">Option 101</a-menu-item>
            <a-menu-item key="102">Option 102</a-menu-item>
            <a-menu-item key="103">Option 103</a-menu-item>
            <a-menu-item key="104">Option 104</a-menu-item>
            <a-menu-item key="105">Option 105</a-menu-item>
            <a-menu-item key="106">Option 106</a-menu-item>
            <a-menu-item key="107">Option 107</a-menu-item>
            <a-menu-item key="108">Option 108</a-menu-item>
            <a-menu-item key="109">Option 109</a-menu-item>
        </a-sub-menu>
    </a-menu>
</template>
<script lang="ts">
    import { defineComponent, reactive, toRefs } from 'vue'
    // import {
    //     MailOutlined,
    //     CalendarOutlined,
    //     AppstoreOutlined,
    //     SettingOutlined,
    // } from '@ant-design/icons-vue'
    import type { MenuProps } from 'ant-design-vue'

    export default defineComponent({
        name: 'JitterCheck',
        components: {
            // MailOutlined,
            // CalendarOutlined,
            // AppstoreOutlined,
            // SettingOutlined,
        },
        setup() {
            const state = reactive({
                selectedKeys: [],
                openKeys: [],
            })
            const handleClick: MenuProps['onClick'] = (menuInfo) => {
                console.log('click ', menuInfo)
            }
            return {
                ...toRefs(state),
                handleClick,
            }
        },
    })
</script>
